import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { ProducerInfo } from '../../components/producer-info'
import { categories, products, search, stores } from '../../lib'
import { ProductCardsGroup } from '../../components/product-card'
import { getFirebaseApp } from '../../lib/firebase-context'

type FilterType = 'category' | 'store' | 'search'

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs: [FilterType, string][] = []

  const allCategories = await categories.getAll(getFirebaseApp())
  allCategories.forEach((c) => slugs.push(['category', c.id]))

  const allStores = await stores.getAll()
  allStores.forEach((s) => slugs.push(['store', s.id]))

  return { paths: slugs.map((s) => ({ params: { slug: s } })), fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<FilterPageProps> = async (ctx) => {
  const { params } = ctx
  const [filterType, filterQuery] = params!.slug as any
  const allStores = await stores.getAll()
  switch (filterType) {
    case 'search':
      const searchProducts = await search.products(filterQuery)
      return {
        props: {
          pageTitle: `${filterQuery} | ЕДНА Е МАЈКА`,
          products: searchProducts.map((p) => [p, allStores.find((s) => s.id === p.store)!])
        }
      }
    case 'category':
      const category = await categories.get(filterQuery)
      const categoryProducts = category == null ? [] : await products.getByCategory(category)

      return {
        props: {
          pageTitle: `${category?.title ?? filterQuery} | ЕДНА Е МАЈКА`,
          products: categoryProducts.map((p) => [p, allStores.find((s) => s.id === p.store)!]),
          queryCategory: category!
        }
      }
    case 'store':
      const store = await stores.get(filterQuery)
      const storeProducts = await products.getByStore(filterQuery)
      return {
        props: {
          pageTitle: `${store.name} | ЕДНА Е МАЈКА`,
          products: storeProducts.map((p) => [p, store]),
          queryStore: store
        }
      }
    default:
      return { props: { pageTitle: 'ЕДНА Е МАЈКА?', products: [] } }
  }
}

type FilterPageProps = {
  pageTitle: string
  products: [products.Product, stores.Store][]
  queryStore?: stores.Store
  queryCategory?: categories.Category
}

const FilterPage = (props: FilterPageProps) => {
  return (
    <>
      <Head>
        <title>{props.pageTitle}</title>
        <meta property="og:title" key="og:title" content={props.pageTitle} />
      </Head>
      <div>
        {props.queryStore && <ProducerInfo store={props.queryStore} />}
        <ProductCardsGroup products={props.products.map(([product, store]) => ({ store, product }))} />
      </div>
    </>
  )
}

export default FilterPage
