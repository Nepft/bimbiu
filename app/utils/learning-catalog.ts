export interface CategorySummary {
  id: string
  title: string
  description: string
  publicMeta: string
  learnerMeta: string
}

export const GENERAL_KNOWLEDGE_CATEGORIES: CategorySummary[] = [
  {
    id: 'science-nature',
    title: 'Science & Nature',
    description: 'Alam, hewan, tumbuhan, sains dasar, dan tata surya.',
    publicMeta: 'Pengetahuan Alam',
    learnerMeta: '1 dari 2 pelajaran selesai',
  },
  {
    id: 'world-geography',
    title: 'World & Geography',
    description: 'Negara, benua, tempat penting, dan geografi dunia.',
    publicMeta: 'Dunia & Geografi',
    learnerMeta: '2 dari 2 pelajaran selesai',
  },
  {
    id: 'history-culture',
    title: 'History & Culture',
    description: 'Sejarah peradaban dan kebudayaan Nusantara hingga dunia.',
    publicMeta: 'Sejarah & Budaya',
    learnerMeta: '1 dari 2 pelajaran selesai',
  },
  {
    id: 'logic-mathematics',
    title: 'Logic & Mathematics',
    description: 'Pola angka, berhitung, dan latihan penalaran.',
    publicMeta: 'Logika & Angka',
    learnerMeta: 'Belum dimulai',
  },
  {
    id: 'language-words',
    title: 'Language & Words',
    description: 'Kosakata, makna kata, dan pengetahuan bahasa.',
    publicMeta: 'Bahasa & Kata',
    learnerMeta: 'Belum dimulai',
  },
  {
    id: 'everyday-knowledge',
    title: 'Everyday Knowledge',
    description: 'Lingkungan sekitar dan pengetahuan kehidupan sehari-hari.',
    publicMeta: 'Sehari-hari',
    learnerMeta: 'Belum dimulai',
  },
]
