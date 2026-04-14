import { Category, NewsItem } from "../types/news";

export const categories: Category[] = [
  { id: "tecnologia", label: "Tecnologia" },
  { id: "politica", label: "Política" },
  { id: "economia", label: "Economia" },
  { id: "sustentabilidade", label: "Sustentabilidade" },
  { id: "brasil", label: "Brasil" },
  { id: "internacional", label: "Internacional" },
];

export const latestNews: NewsItem[] = [
  {
    id: "1",
    title: "Tecnologia revoluciona o mercado de trabalho brasileiro",
    summary:
      "Inteligência artificial e automação transformam profissões tradicionais e criam novas oportunidades.",
    author: "Maria Santos",
    publishedAt: "Hoje, 14:30",
    tags: ["Tecnologia", "Mercado"],
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    title: "Nova política de sustentabilidade impacta empresas",
    summary:
      "Governo anuncia medidas para reduzir emissões de carbono em 40% até 2030.",
    author: "João Silva",
    publishedAt: "Ontem, 09:15",
    tags: ["Política", "Sustentabilidade"],
    imageUrl:
      "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    title: "Economia cresce acima do esperado no primeiro trimestre",
    summary:
      "PIB surpreende analistas com expansão de 2.8%, impulsionado por exportações.",
    author: "Ana Oliveira",
    publishedAt: "2 dias atrás",
    tags: ["Economia", "Brasil"],
    imageUrl:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=1200&q=80",
  },
];
