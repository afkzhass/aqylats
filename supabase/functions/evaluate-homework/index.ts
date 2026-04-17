import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId } = await req.json();
    if (!submissionId) throw new Error("submissionId is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Load submission + assignment
    const { data: sub, error: subErr } = await supabase
      .from("homework_submissions")
      .select("id, answer_text, assignment_id, student_id")
      .eq("id", submissionId)
      .single();
    if (subErr || !sub) throw new Error("Submission not found");

    const { data: assignment } = await supabase
      .from("homework_assignments")
      .select("title, description, ai_evaluation_criteria")
      .eq("id", sub.assignment_id)
      .single();

    const systemPrompt = `Ты — AI-проверяющий учитель в Aqyl AI. Оценивай ответы учеников по 10-балльной шкале.

ВАЖНО:
- Принимай ЛЮБОЙ корректный метод решения, не только классический.
- Если результат верен и логика обоснована — ставь высокий балл, даже если метод нестандартный.
- Будь конструктивным: укажи, что сделано правильно, и где есть ошибки.
- Отвечай на русском.
- Ответ ДОЛЖНЫ быть строго в формате через tool call: score (0-10) + краткий комментарий (2-4 предложения).`;

    const userPrompt = `Задание: ${assignment?.title || "—"}
Описание: ${assignment?.description || "—"}
Критерии оценки: ${assignment?.ai_evaluation_criteria || "Стандартные критерии корректности и полноты ответа."}

Ответ ученика:
"""
${sub.answer_text || "(пустой ответ)"}
"""

Оцени ответ.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_evaluation",
              description: "Submit a graded evaluation of the student's homework answer.",
              parameters: {
                type: "object",
                properties: {
                  score: {
                    type: "integer",
                    minimum: 0,
                    maximum: 10,
                    description: "Score from 0 to 10",
                  },
                  comment: {
                    type: "string",
                    description: "2-4 sentence constructive feedback in Russian",
                  },
                },
                required: ["score", "comment"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_evaluation" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Слишком много запросов. Попробуйте позже." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "Необходимо пополнить баланс AI-кредитов." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      throw new Error("AI gateway error");
    }

    const aiJson = await aiResp.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No evaluation returned by AI");

    const args = JSON.parse(toolCall.function.arguments);
    const score = Math.max(0, Math.min(10, parseInt(args.score)));
    const comment = String(args.comment || "").slice(0, 1000);

    // Persist
    const { error: updErr } = await supabase
      .from("homework_submissions")
      .update({
        ai_score: score,
        ai_comment: comment,
        status: "ai_reviewed",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", submissionId);
    if (updErr) throw updErr;

    return new Response(JSON.stringify({ success: true, score, comment }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-homework error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
