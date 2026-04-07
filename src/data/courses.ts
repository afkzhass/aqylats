export const subjects = ["Все", "Математика", "Физика", "История", "Қазақ тілі", "Биология", "Химия"] as const;

export type Subject = (typeof subjects)[number];

export interface Lesson {
  id: string;
  title: string;
  duration: string;
}

export interface Course {
  id: string;
  name: string;
  subject: Exclude<Subject, "Все">;
  grade: string;
  lessons: number;
  emoji: string;
  gradient: string;
  badgeColor: string;
  lessonList: Lesson[];
}

export const courses: Course[] = [
  {
    id: "algebra",
    name: "Алгебра и начала анализа",
    subject: "Математика",
    grade: "11 кл",
    lessons: 24,
    emoji: "📐",
    gradient: "from-blue-100 to-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
    lessonList: [
      { id: "1", title: "Предел функции", duration: "40 мин" },
      { id: "2", title: "Производная функции", duration: "45 мин" },
      { id: "3", title: "Правила дифференцирования", duration: "40 мин" },
    ],
  },
  {
    id: "quantum-physics",
    name: "Квантовая физика",
    subject: "Физика",
    grade: "11 кл",
    lessons: 18,
    emoji: "⚛️",
    gradient: "from-green-100 to-green-200",
    badgeColor: "bg-green-100 text-green-700",
    lessonList: [
      { id: "1", title: "Фотоэлектрический эффект и квантовая природа света", duration: "45 мин" },
      { id: "2", title: "Модель атома Бора", duration: "40 мин" },
      { id: "3", title: "Волновые свойства частиц", duration: "45 мин" },
    ],
  },
  {
    id: "history-kz",
    name: "Казахстан в XX веке",
    subject: "История",
    grade: "11 кл",
    lessons: 30,
    emoji: "📜",
    gradient: "from-orange-100 to-orange-200",
    badgeColor: "bg-amber-100 text-amber-700",
    lessonList: [
      { id: "1", title: "Казахстан в начале XX века", duration: "40 мин" },
      { id: "2", title: "Национально-освободительное движение", duration: "45 мин" },
      { id: "3", title: "Казахстан в годы ВОВ", duration: "40 мин" },
    ],
  },
  {
    id: "kazakh-language",
    name: "Синтаксис және пунктуация",
    subject: "Қазақ тілі",
    grade: "11 кл",
    lessons: 22,
    emoji: "✍️",
    gradient: "from-pink-100 to-pink-200",
    badgeColor: "bg-pink-100 text-pink-700",
    lessonList: [
      { id: "1", title: "Жай сөйлем", duration: "40 мин" },
      { id: "2", title: "Құрмалас сөйлем", duration: "45 мин" },
      { id: "3", title: "Тыныс белгілері", duration: "40 мин" },
    ],
  },
  {
    id: "biology",
    name: "Генетика и эволюция",
    subject: "Биология",
    grade: "11 кл",
    lessons: 16,
    emoji: "🧬",
    gradient: "from-teal-100 to-teal-200",
    badgeColor: "bg-teal-100 text-teal-700",
    lessonList: [
      { id: "1", title: "Законы Менделя", duration: "45 мин" },
      { id: "2", title: "Генетический код", duration: "40 мин" },
      { id: "3", title: "Теория эволюции", duration: "45 мин" },
    ],
  },
  {
    id: "chemistry",
    name: "Органическая химия",
    subject: "Химия",
    grade: "11 кл",
    lessons: 20,
    emoji: "🧪",
    gradient: "from-purple-100 to-purple-200",
    badgeColor: "bg-purple-100 text-purple-700",
    lessonList: [
      { id: "1", title: "Углеводороды", duration: "40 мин" },
      { id: "2", title: "Спирты и фенолы", duration: "45 мин" },
      { id: "3", title: "Карбоновые кислоты", duration: "40 мин" },
    ],
  },
];