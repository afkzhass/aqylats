// Automated RLS / policy tests.
// Run with the Supabase edge-function test runner:
//   supabase--test_edge_functions { "functions": ["security-tests"] }
//
// Each test provisions disposable users via the service role, signs them in
// to obtain real JWTs, then exercises Supabase from the *user* perspective so
// that RLS policies are actually evaluated. Service-role clients are only used
// for setup/teardown and to verify final DB state.
//
// Scenarios covered:
//   1. user_roles is NOT writable by non-admins (privilege escalation guard).
//   2. user_roles IS writable by admins.
//   3. Student can enroll via class code (join_group_by_code) and only sees
//      their own membership.
//   4. Students cannot read group_codes directly (codes are hidden).
//   5. Teacher of a group can read its class code.
//   6. Student cannot UPDATE ai_score / ai_comment / teacher_grade /
//      teacher_comment / reviewed_at / status on their own submission.
//   7. Teacher (owner of the assignment) CAN update grading fields.
//   8. Student cannot read another student's submission.
//   9. anon role cannot call security-definer RPCs (has_role,
//      join_group_by_code).

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  assert,
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY =
  Deno.env.get("SUPABASE_ANON_KEY") ??
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
  "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE) {
  throw new Error(
    "Missing env: need SUPABASE_URL, SUPABASE_(ANON|PUBLISHABLE)_KEY, SUPABASE_SERVICE_ROLE_KEY",
  );
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const anon = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------- helpers ----------

const rand = () => Math.random().toString(36).slice(2, 10);

async function makeUser(role: "admin" | "teacher" | "student") {
  const email = `rls-${role}-${rand()}@test.local`;
  const password = `Pw!${rand()}${rand()}`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  const userId = data.user!.id;

  // handle_new_user trigger inserts a 'student' row. For non-student
  // targets, overwrite via service role.
  if (role !== "student") {
    await admin.from("user_roles").delete().eq("user_id", userId);
    const { error: rErr } = await admin
      .from("user_roles")
      .insert({ user_id: userId, role });
    if (rErr) throw rErr;
  }

  // Sign in to obtain a JWT-bound client (RLS will see auth.uid()).
  const client = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: sErr } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (sErr) throw sErr;
  return { userId, email, client };
}

async function cleanupUser(userId: string) {
  try {
    await admin.auth.admin.deleteUser(userId);
  } catch {
    /* ignore */
  }
}

async function createGroup(teacherId: string) {
  const { data, error } = await admin
    .from("groups")
    .insert({ teacher_id: teacherId, class_name: `RLS Test ${rand()}` })
    .select("id")
    .single();
  if (error) throw error;
  // class_code is auto-issued by trigger into group_codes
  const { data: code } = await admin
    .from("group_codes")
    .select("class_code")
    .eq("group_id", data.id)
    .single();
  return { groupId: data.id as string, classCode: code!.class_code as string };
}

async function createAssignment(teacherId: string, groupId: string) {
  const { data, error } = await admin
    .from("homework_assignments")
    .insert({
      teacher_id: teacherId,
      group_id: groupId,
      course_id: "general",
      title: "RLS test assignment",
      ai_evaluation_criteria: "n/a",
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

async function createSubmission(
  studentClient: SupabaseClient,
  assignmentId: string,
  studentId: string,
) {
  const { data, error } = await studentClient
    .from("homework_submissions")
    .insert({
      assignment_id: assignmentId,
      student_id: studentId,
      answer_text: "test answer",
      status: "submitted",
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

// ---------- tests ----------

Deno.test("user_roles: non-admin cannot escalate role", async () => {
  const student = await makeUser("student");
  try {
    const { error } = await student.client
      .from("user_roles")
      .insert({ user_id: student.userId, role: "admin" });
    assertExists(error, "RLS must block student self-promotion");
    // Verify DB state too.
    const { data } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", student.userId);
    const roles = (data ?? []).map((r: any) => r.role);
    assert(!roles.includes("admin"), "student must not have admin role");
  } finally {
    await cleanupUser(student.userId);
  }
});

Deno.test("user_roles: admin can grant a role", async () => {
  const adminUser = await makeUser("admin");
  const target = await makeUser("student");
  try {
    const { error } = await adminUser.client
      .from("user_roles")
      .insert({ user_id: target.userId, role: "teacher" });
    assertEquals(error, null, "admin must be able to insert roles");
    const { data } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", target.userId);
    const roles = (data ?? []).map((r: any) => r.role);
    assert(roles.includes("teacher"));
  } finally {
    await cleanupUser(adminUser.userId);
    await cleanupUser(target.userId);
  }
});

Deno.test("group_codes: student cannot read codes directly", async () => {
  const teacher = await makeUser("teacher");
  const student = await makeUser("student");
  try {
    const { groupId } = await createGroup(teacher.userId);
    const { data, error } = await student.client
      .from("group_codes")
      .select("class_code")
      .eq("group_id", groupId);
    // Either RLS returns empty rows or a permission error — both acceptable.
    assert(
      (error !== null) || (Array.isArray(data) && data.length === 0),
      "student must not see class_code rows",
    );
  } finally {
    await cleanupUser(teacher.userId);
    await cleanupUser(student.userId);
  }
});

Deno.test("group_codes: teacher of group can read its code", async () => {
  const teacher = await makeUser("teacher");
  try {
    const { groupId, classCode } = await createGroup(teacher.userId);
    const { data, error } = await teacher.client
      .from("group_codes")
      .select("class_code")
      .eq("group_id", groupId)
      .single();
    assertEquals(error, null);
    assertEquals(data!.class_code, classCode);
  } finally {
    await cleanupUser(teacher.userId);
  }
});

Deno.test("enrollment: student joins via class code RPC", async () => {
  const teacher = await makeUser("teacher");
  const student = await makeUser("student");
  try {
    const { groupId, classCode } = await createGroup(teacher.userId);
    const { data, error } = await student.client.rpc("join_group_by_code", {
      _code: classCode,
    });
    assertEquals(error, null);
    assertEquals((data as any).success, true);

    // Student can see only their own membership.
    const { data: mine } = await student.client
      .from("group_members")
      .select("group_id, student_id");
    assert((mine ?? []).every((m: any) => m.student_id === student.userId));
    assert((mine ?? []).some((m: any) => m.group_id === groupId));
  } finally {
    await cleanupUser(teacher.userId);
    await cleanupUser(student.userId);
  }
});

Deno.test("submissions: student cannot modify ai_*/teacher_*/status fields", async () => {
  const teacher = await makeUser("teacher");
  const student = await makeUser("student");
  try {
    const { groupId, classCode } = await createGroup(teacher.userId);
    await student.client.rpc("join_group_by_code", { _code: classCode });
    const assignmentId = await createAssignment(teacher.userId, groupId);
    const submissionId = await createSubmission(
      student.client,
      assignmentId,
      student.userId,
    );

    const forbidden = [
      { ai_score: 10 },
      { ai_comment: "hacked" },
      { teacher_grade: 10 },
      { teacher_comment: "hacked" },
      { reviewed_at: new Date().toISOString() },
      { status: "graded" },
    ];
    for (const patch of forbidden) {
      const { error } = await student.client
        .from("homework_submissions")
        .update(patch)
        .eq("id", submissionId);
      assertExists(
        error,
        `Student must NOT update ${Object.keys(patch)[0]}`,
      );
    }

    // Verify untouched in DB.
    const { data: row } = await admin
      .from("homework_submissions")
      .select("ai_score, ai_comment, teacher_grade, teacher_comment, reviewed_at, status")
      .eq("id", submissionId)
      .single();
    assertEquals(row!.ai_score, null);
    assertEquals(row!.teacher_grade, null);
    assertEquals(row!.status, "submitted");
  } finally {
    await cleanupUser(teacher.userId);
    await cleanupUser(student.userId);
  }
});

Deno.test("submissions: assignment teacher can grade", async () => {
  const teacher = await makeUser("teacher");
  const student = await makeUser("student");
  try {
    const { groupId, classCode } = await createGroup(teacher.userId);
    await student.client.rpc("join_group_by_code", { _code: classCode });
    const assignmentId = await createAssignment(teacher.userId, groupId);
    const submissionId = await createSubmission(
      student.client,
      assignmentId,
      student.userId,
    );

    const { error } = await teacher.client
      .from("homework_submissions")
      .update({
        teacher_grade: 9,
        teacher_comment: "good",
        status: "graded",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", submissionId);
    assertEquals(error, null, "teacher of assignment must be able to grade");

    const { data } = await admin
      .from("homework_submissions")
      .select("teacher_grade, status")
      .eq("id", submissionId)
      .single();
    assertEquals(data!.teacher_grade, 9);
    assertEquals(data!.status, "graded");
  } finally {
    await cleanupUser(teacher.userId);
    await cleanupUser(student.userId);
  }
});

Deno.test("submissions: student cannot read another student's submission", async () => {
  const teacher = await makeUser("teacher");
  const studentA = await makeUser("student");
  const studentB = await makeUser("student");
  try {
    const { groupId, classCode } = await createGroup(teacher.userId);
    await studentA.client.rpc("join_group_by_code", { _code: classCode });
    await studentB.client.rpc("join_group_by_code", { _code: classCode });
    const assignmentId = await createAssignment(teacher.userId, groupId);
    const subA = await createSubmission(
      studentA.client,
      assignmentId,
      studentA.userId,
    );

    const { data } = await studentB.client
      .from("homework_submissions")
      .select("id")
      .eq("id", subA);
    assertEquals(
      (data ?? []).length,
      0,
      "student B must not see student A's submission",
    );
  } finally {
    await cleanupUser(teacher.userId);
    await cleanupUser(studentA.userId);
    await cleanupUser(studentB.userId);
  }
});

Deno.test("anon: cannot execute security-definer RPCs", async () => {
  const { error: e1 } = await anon.rpc("has_role", {
    _user_id: "00000000-0000-0000-0000-000000000000",
    _role: "admin",
  });
  assertExists(e1, "anon must not execute has_role");

  const { error: e2 } = await anon.rpc("join_group_by_code", {
    _code: "ZZZZZZ",
  });
  assertExists(e2, "anon must not execute join_group_by_code");
});
