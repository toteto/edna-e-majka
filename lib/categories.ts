import fs from 'fs'
import { join } from 'path'

const categoriesPath = join(process.cwd(), 'data', 'categories.json')

export type Category = {
  id: string
  name: string
  subcategories?: Category[]
}

export const matchesCategory = (maybeParent: Category, childCategoryId: string): boolean => {
  return (
    maybeParent.id === childCategoryId ||
    maybeParent.subcategories?.some((subcategory) => matchesCategory(subcategory, childCategoryId)) ||
    false
  )
}

const findCategories = (ids: string[], categories: Category[]): Category[] => {
  const results: Category[] = []
  categories.forEach((category) => {
    if (ids.find((id) => id === category.id)) results.push(category)
    if (category.subcategories) results.push(...findCategories(ids, category.subcategories))
  })
  return results
}

export const fetchCategories = async (...ids: string[]) => {
  const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8')) as Category[]
  if (ids.length > 0) {
    return findCategories(ids, categories)
  } else {
    return categories
  }
}
