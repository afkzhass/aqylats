import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { messages, lessonContext, progress } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Ты — AI-помощник образовательной платформы Aqyl AI. Ты помогаешь ученикам 11 класса изучать школьные предметы.

КОНТЕКСТ УРОКА:
${lessonContext || "Контекст урока не предоставлен."}

ПРОГРЕСС УЧЕНИКА:
${progress || "Информация о прогрессе недоступна."}

ТВОИ ЗАДАЧИ:
1. Отвечай на вопросы по содержимому урока понятным языком.
2. Анализируй прогресс ученика и давай рекомендации.
3. Оценивай ответы ученика на задачи — принимай ЛЮБЫЕ корректные методы решения, не только классические. Если ученик решил задачу нестандартным, но математически/физически верным способом — похвали за креативность.
4. Объясняй ошибки мягко и конструктивно, предлагая подсказки вместо готовых ответов.
5. Можешь давать дополнительные задачи для закрепления.
6. Поддерживай русский и казахский языки.

ВАЖНО: При оценке решений не привязывайся к единственному "правильному" методу. Если результат верен и логика обоснована — решение правильное, даже если метод отличается от учебника.

Используй markdown для форматирования: формулы, списки, жирный текст.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов. Попробуйте позже." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Необходимо пополнить баланс AI-кредитов." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Ошибка AI-сервиса" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});