export type Category = {
  id: string
  title: string
  parent?: string
}

const categories: Category[] = [
  {
    id: 'fruits',
    title: 'Овошје'
  },
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
    id: 'spread',
    title: 'Намази'
  },
  {
    id: 'jams-jelly',
    title: 'Слатко и џем'
  },
  {
    id: 'forest-products',
    title: 'Шумски плодови'
  },
  {
    id: 'mushrooms',
    title: 'Печурки'
  }
]

export const fetchCategories = async (...ids: string[]) => {
  return ids.length > 0 ? categories.filter((c) => ids.includes(c.id)) : [...categories]
}
