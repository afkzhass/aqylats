import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Loader2, GraduationCap, BookOpen } from "lucide-react";

const subjectOptions = ["Математика", "Физика", "Химия", "Биология", "История", "Қазақ тілі"] as const;
const gradeOptions = Array.from({ length: 11 }, (_, i) => i + 1);

type Role = "student" | "teacher";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [grade, setGrade] = useState(7);
  const [subject, setSubject] = useState(subjectOptions[0]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Вход выполнен!");
        navigate("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        // After signup, update profile with role-specific data
        if (data.user) {
          const profileUpdate: Record<string, any> = {
            assigned_class: role === "student" ? grade : null,
            subject: role === "teacher" ? subject : null,
          };
          // Wait a moment for the trigger to create the profile
          setTimeout(async () => {
            await supabase
              .from("profiles")
              .update(profileUpdate)
              .eq("user_id", data.user!.id);
          }, 1000);

          // Set the correct role (trigger sets 'student' by default)
          if (role === "teacher") {
            setTimeout(async () => {
              await supabase
                .from("user_roles")
                .update({ role: "teacher" })
                .eq("user_id", data.user!.id);
            }, 1000);
          }
        }

        toast.success("Проверьте почту для подтверждения регистрации!");
      }
    } catch (err: any) {
      toast.error(err.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Ошибка входа через Google");
      return;
    }
    if (result.redirected) return;
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-accent-foreground font-bold text-xl font-serif mx-auto mb-3">
            A
          </div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Aqyl AI</h1>
          <p className="text-sm text-muted-foreground mt-1">Білім платформасы</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-serif font-semibold text-foreground text-center mb-6">
            {isLogin ? "Вход в аккаунт" : "Регистрация"}
          </h2>

          {/* Google */}
          <Button
            variant="outline"
            className="w-full mb-4 gap-2"
            onClick={handleGoogleLogin}
            type="button"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Войти через Google
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">или</span></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="fullName" className="text-sm">Полное имя</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Айгуль Серикова" className="pl-10" required />
                  </div>
                </div>

                {/* Role selection */}
                <div>
                  <Label className="text-sm mb-2 block">Выберите роль</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        role === "student"
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-muted-foreground hover:border-accent/40"
                      }`}
                    >
                      <GraduationCap size={28} />
                      <span className="text-sm font-medium">Ученик</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("teacher")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        role === "teacher"
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-muted-foreground hover:border-accent/40"
                      }`}
                    >
                      <BookOpen size={28} />
                      <span className="text-sm font-medium">Учитель</span>
                    </button>
                  </div>
                </div>

                {/* Grade selection for students */}
                {role === "student" && (
                  <div>
                    <Label htmlFor="grade" className="text-sm">Класс</Label>
                    <select
                      id="grade"
                      value={grade}
                      onChange={(e) => setGrade(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    >
                      {gradeOptions.map((g) => (
                        <option key={g} value={g}>{g} класс</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Subject selection for teachers */}
                {role === "teacher" && (
                  <div>
                    <Label htmlFor="subject" className="text-sm">Предмет</Label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    >
                      {subjectOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.kz" className="pl-10" required />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-sm">Пароль</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" minLength={6} required />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-accent hover:underline font-medium">
              {isLogin ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
