export type Category = {
  id: string
  title: string
  parent?: string
}

const categories: Category[] = [
  {
    id: 'bee-products',
    title: 'Пчелни производи'
  },
  {
    id: 'honey',
    title: 'Мед'
  },
  {
    id: 'pasta',
    title: 'Тестенини'
  },
  {
    id: 'jams-jelly',
    title: 'Слатко и џем'
  },
  {
    id: 'spread',
    title: 'Намази'
  }
].sort((c1, c2) => c1.title.localeCompare(c2.title))

export const fetchCategories = async (...ids: string[]) => {
  return ids.length > 0 ? categories.filter((c) => ids.includes(c.id)) : [...categories]
}
