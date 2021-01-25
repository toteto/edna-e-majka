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
    title: 'Мед',
    parent: 'bee-products'
  },
  {
    id: 'pasta',
    title: 'Тестенини'
  },
  {
    id: 'pastries',
    title: 'Месени работи'
  },
  {
    id: 'meat',
    title: 'Месо'
  }
]

export const fetchCategories = async (...ids: string[]) => {
  return ids.length > 0 ? categories.filter((c) => ids.includes(c.id)) : [...categories]
}
