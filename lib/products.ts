import { join } from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import { Category, fetchCategories, matchesCategory } from './categories'
import { City, fetchLocations } from './cities'

const productsDir = join(process.cwd(), 'data', 'products')
const publicDir = join(process.cwd(), 'public')

export type Producer = {
  id: string
  name: string
  avatar: string
  contact: {
    phone?: string
    mail?: string
    facebook?: string
    instagram?: string
  }
  desc: string
}

export type Product = {
  id: string
  title: string
  images: string[]
  price: string
  categories: Category[]
  addedDate: string
  shortDescription: string
  fullDescription: string
}

export const fetchProduct = async (producer: string, product: string): Promise<Product> => {
  const fileContent = fs.readFileSync(join(productsDir, producer, `${product}.md`))

  const images: string[] = []
  let i = 1
  while (true) {
    const relativeImagePath = join('/assets', producer, `${product}-${i}.jpg`)
    const fullPath = join(publicDir, relativeImagePath)

    if (fs.existsSync(fullPath)) {
      images.push(relativeImagePath)
      i++
    } else {
      break
    }
  }

  const { data, content } = matter(fileContent)
  return {
    id: product,
    title: data.title,
    images,
    price: data.price,
    categories: await fetchCategories(...data.categories),
    addedDate: data.addedDate,
    shortDescription: data.shortDescription,
    fullDescription: (await remark().use(html).process(content)).toString()
  }
}

export const fetchProducer = async (producer: string): Promise<Producer> => {
  const fileContent = fs.readFileSync(join(productsDir, producer, '_.md'))
  const { data, content } = matter(fileContent)
  const desc = (await remark().use(html).process(content)).toString()

  return {
    id: producer,
    name: data.name,
    avatar: data.avatar ?? `/assets/${producer}/_.png`,
    contact: {
      ...data.contact
    },
    desc
  }
}

export const fetchProductsByProducer = async (producerId: string) => {
  const ids = await fetchProductsGroupedByProducers()

  const resultIds = ids.find(({ producer }) => producer === producerId)
  const producer = await fetchProducer(producerId)

  const products: { producer: Producer; product: Product }[] = []
  for (const product of resultIds?.products ?? []) {
    products.push({ producer, product: await fetchProduct(producerId, product) })
  }

  return { producer, products }
}

export const fetchProductsByCategory = async (categoryId: string) => {
  const category = (await fetchCategories(categoryId))[0]
  const ids = await fetchProductsWithProducers()
  const results: { producer: Producer; product: Product }[] = []
  for (const pair of ids) {
    const producer = await fetchProducer(pair.producer)
    const product = await fetchProduct(pair.producer, pair.product)
    if (product.categories.some((c) => matchesCategory(category, c.id))) results.push({ producer, product })
  }

  return results
}

export const fetchProductsBySearchQuery = async (term: string): Promise<{ producer: Producer; product: Product }[]> => {
  const ids = await fetchProductsGroupedByProducers()
  const searchSpace: { producer: Producer; product: Product }[] = []
  for (const pair of ids) {
    const producer = await fetchProducer(pair.producer)
    const products: Product[] = []
    for (const productId of pair.products) {
      products.push(await fetchProduct(pair.producer, productId))
    }
    searchSpace.push(...products.map((product) => ({ producer, product })))
  }

  const Fuse = (await import('fuse.js')).default
  const fuse = new Fuse(searchSpace, {
    ignoreLocation: true,
    includeScore: true,
    threshold: 0.2,
    keys: [
      {
        name: 'product.title',
        weight: 1
      },
      {
        name: 'product.shortDescription:',
        weight: 0.4
      },
      {
        name: 'product.fullDescription::',
        weight: 0.2
      },
      {
        name: 'product.categories.name',
        weight: 0.5
      },
      {
        name: 'producer.name',
        weight: 0.4
      }
    ]
  })
  const searchResults = fuse.search(term)
  return searchResults.map((res) => res.item)
}

export const fetchProductsWithProducers = async () =>
  (await fetchProductsGroupedByProducers()).flatMap(({ products, producer }) =>
    products.map((product) => ({ product, producer }))
  )

export const fetchProductsGroupedByProducers = async () => {
  const producers = fs.readdirSync(productsDir)
  return producers.map((producer) => {
    const products = fs
      .readdirSync(join(productsDir, producer))
      .filter((f) => f !== '_.md') // remove producer info
      .map((pid) => pid.replace(/\.md$/, '')) // remove .md extension

    return { producer, products }
  })
}
