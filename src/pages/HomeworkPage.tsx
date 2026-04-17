import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Plus, FileText, CheckCircle, Clock, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  submitted: { label: "Отправлено", color: "bg-blue-100 text-blue-700", icon: Clock },
  ai_reviewed: { label: "AI проверено", color: "bg-purple-100 text-purple-700", icon: Sparkles },
  pending_review: { label: "Ожидает проверки", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  graded: { label: "Оценено", color: "bg-green-100 text-green-700", icon: CheckCircle },
};

const HomeworkPage = () => {
  const { user } = useAuth();
  const { isTeacher, isAdmin, isStudent } = useUserRole();
  const canCreate = isTeacher || isAdmin;

  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [aiCriteria, setAiCriteria] = useState("");

  // Submission
  const [answerText, setAnswerText] = useState("");
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [autoEvaluate, setAutoEvaluate] = useState(true);

  // Grading
  const [gradeValue, setGradeValue] = useState("");
  const [teacherComment, setTeacherComment] = useState("");

  const fetchData = async () => {
    const [{ data: hw }, { data: grps }] = await Promise.all([
      supabase.from("homework_assignments").select("*").order("created_at", { ascending: false }),
      supabase.from("groups").select("id, class_name"),
    ]);
    setAssignments(hw || []);
    setGroups(grps || []);
    setLoading(false);
  };

  const fetchSubmissions = async (assignmentId: string) => {
    const { data } = await supabase
      .from("homework_submissions")
      .select("*")
      .eq("assignment_id", assignmentId);

    if (data && data.length > 0) {
      const studentIds = data.map((s) => s.student_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", studentIds);
      setSubmissions(
        data.map((s) => ({ ...s, profile: profiles?.find((p) => p.user_id === s.student_id) }))
      );
    } else {
      setSubmissions(data || []);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createAssignment = async () => {
    if (!title.trim() || !user) return;
    const { error } = await supabase.from("homework_assignments").insert({
      title: title.trim(),
      description,
      course_id: "general",
      teacher_id: user.id,
      group_id: groupId || null,
      deadline: deadline || null,
      ai_evaluation_criteria: aiCriteria,
    });
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Задание создано" });
      setTitle(""); setDescription(""); setGroupId(""); setDeadline(""); setAiCriteria("");
      setDialogOpen(false);
      fetchData();
    }
  };

  const evaluateWithAI = async (submissionId: string) => {
    setEvaluatingId(submissionId);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-homework", {
        body: { submissionId },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({
        title: "AI-проверка готова",
        description: `Оценка: ${(data as any).score}/10`,
      });
      if (selectedAssignment) await fetchSubmissions(selectedAssignment.id);
    } catch (e: any) {
      toast({
        title: "Ошибка AI-проверки",
        description: e?.message || "Не удалось оценить",
        variant: "destructive",
      });
    } finally {
      setEvaluatingId(null);
    }
  };

  const submitAnswer = async () => {
    if (!selectedAssignment || !user) return;
    const { data, error } = await supabase
      .from("homework_submissions")
      .insert({
        assignment_id: selectedAssignment.id,
        student_id: user.id,
        answer_text: answerText,
        status: "submitted",
      })
      .select("id")
      .single();
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Ответ отправлен" });
    setAnswerText("");
    setSubmitDialogOpen(false);
    await fetchSubmissions(selectedAssignment.id);
    if (autoEvaluate && data?.id) {
      evaluateWithAI(data.id);
    }
  };

  const gradeSubmission = async (submissionId: string) => {
    const { error } = await supabase.from("homework_submissions").update({
      teacher_grade: parseInt(gradeValue),
      teacher_comment: teacherComment,
      status: "graded" as any,
      reviewed_at: new Date().toISOString(),
    }).eq("id", submissionId);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Оценка выставлена" });
      setGradeValue(""); setTeacherComment("");
      fetchSubmissions(selectedAssignment.id);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Домашние задания</h1>
          <p className="text-sm text-muted-foreground">{canCreate ? "Создавайте задания и проверяйте ответы" : "Ваши задания"}</p>
        </div>
        {canCreate && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus size={16} /> Новое задание</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Создать задание</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Название задания" value={title} onChange={e => setTitle(e.target.value)} />
                <Textarea placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} />
                <Select value={groupId} onValueChange={setGroupId}>
                  <SelectTrigger><SelectValue placeholder="Группа (необязательно)" /></SelectTrigger>
                  <SelectContent>
                    {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.class_name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} />
                <Textarea placeholder="Эталон / критерии AI-оценки (что должно быть в правильном ответе)" value={aiCriteria} onChange={e => setAiCriteria(e.target.value)} rows={3} />
                <Button onClick={createAssignment} className="w-full">Создать</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-3">
        {assignments.map(a => (
          <div
            key={a.id}
            className={`bg-card border rounded-xl p-5 cursor-pointer hover:shadow-md transition-all ${selectedAssignment?.id === a.id ? "border-accent" : "border-border"}`}
            onClick={() => { setSelectedAssignment(a); fetchSubmissions(a.id); }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mt-0.5">
                  <FileText size={20} className="text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{a.title}</p>
                  {a.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>}
                </div>
              </div>
              {a.deadline && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  до {new Date(a.deadline).toLocaleDateString("ru")}
                </span>
              )}
            </div>
          </div>
        ))}
        {assignments.length === 0 && <p className="text-muted-foreground text-center py-8">Нет заданий</p>}
      </div>

      {selectedAssignment && (
        <div className="mt-8 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif font-medium text-foreground">{selectedAssignment.title}</h2>
            {isStudent && (
              <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2"><Plus size={14} /> Сдать</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Сдать задание</DialogTitle></DialogHeader>
                  <Textarea placeholder="Ваш ответ" value={answerText} onChange={e => setAnswerText(e.target.value)} rows={6} />
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" checked={autoEvaluate} onChange={e => setAutoEvaluate(e.target.checked)} />
                    <Sparkles size={14} className="text-accent" />
                    Автоматическая AI-проверка после отправки
                  </label>
                  <Button onClick={submitAnswer}>Отправить</Button>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {selectedAssignment.description && (
            <p className="text-sm text-muted-foreground mb-4">{selectedAssignment.description}</p>
          )}

          <h3 className="text-sm font-medium text-foreground mb-3">Ответы учеников</h3>
          <div className="space-y-3">
            {submissions.map(s => {
              const st = statusLabels[s.status] || statusLabels.submitted;
              const isMine = s.student_id === user?.id;
              return (
                <div key={s.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{s.profile?.full_name || s.profile?.email || "Ученик"}</p>
                    <Badge variant="secondary" className={st.color}>{st.label}</Badge>
                  </div>
                  {s.answer_text && <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">{s.answer_text}</p>}
                  {s.ai_score != null && (
                    <div className="text-xs bg-purple-50 border border-purple-100 rounded-lg p-2 mb-2">
                      <div className="flex items-center gap-1 text-purple-700 font-medium mb-1">
                        <Sparkles size={12} /> AI-оценка: {s.ai_score}/10
                      </div>
                      <div className="text-muted-foreground">{s.ai_comment}</div>
                    </div>
                  )}
                  {s.teacher_grade != null && (
                    <div className="text-xs text-muted-foreground">Оценка учителя: <span className="font-medium text-foreground">{s.teacher_grade}</span> {s.teacher_comment && `— ${s.teacher_comment}`}</div>
                  )}

                  {/* AI-evaluation button: visible to author or teacher/admin */}
                  {(isMine || canCreate) && s.ai_score == null && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 mt-2"
                      onClick={() => evaluateWithAI(s.id)}
                      disabled={evaluatingId === s.id}
                    >
                      {evaluatingId === s.id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      AI-проверка
                    </Button>
                  )}

                  {canCreate && s.status !== "graded" && (
                    <div className="flex gap-2 mt-3">
                      <Input type="number" placeholder="Оценка" value={gradeValue} onChange={e => setGradeValue(e.target.value)} className="w-24" />
                      <Input placeholder="Комментарий" value={teacherComment} onChange={e => setTeacherComment(e.target.value)} className="flex-1" />
                      <Button size="sm" onClick={() => gradeSubmission(s.id)}>Оценить</Button>
                    </div>
                  )}
                </div>
              );
            })}
            {submissions.length === 0 && <p className="text-sm text-muted-foreground">Пока нет ответов</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkPage;
