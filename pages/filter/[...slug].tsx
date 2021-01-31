import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { ProducerInfo } from '../../components/producer-info'
import { ProductCard, ProductCardsGroup } from '../../components/product-card'
import { Category, fetchCategories } from '../../lib/categories'
import {
  fetchProducerIds as fetchProducersIds,
  fetchProductsByCategory,
  fetchProductsByProducer,
  fetchProductsBySearchQuery,
  Producer,
  Product
} from '../../lib/products'

type FilterType = 'category' | 'producer' | 'search'

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs: [FilterType, string][] = []

  const categories = await fetchCategories()
  categories.forEach((c) => slugs.push(['category', c.id]))

  const producers = await fetchProducersIds()
  producers.forEach((p) => slugs.push(['producer', p]))

  return { paths: slugs.map((s) => ({ params: { slug: s } })), fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<FilterPageProps> = async (ctx) => {
  const { params } = ctx
  const [filterType, filterQuery] = params!.slug as any

  switch (filterType) {
    case 'category':
      const category = (await fetchCategories(filterQuery))[0]
      return {
        props: {
          pageTitle: `${category?.title ?? filterQuery} | ЕДНА Е МАЈКА`,
          products: await fetchProductsByCategory(filterQuery)
        }
      }
    case 'producer':
      try {
        const result = await fetchProductsByProducer(filterQuery)
        return {
          props: {
            pageTitle: `${result.producer.name} | ЕДНА Е МАЈКА`,
            products: result.products,
            producerInfo: result.producer
          }
        }
      } catch (e) {
        console.error(`Filtering for invalid user ->${filterQuery}<-`, e)
      }
    case 'search':
      return {
        props: { pageTitle: `${filterQuery} | ЕДНА Е МАЈКА`, products: await fetchProductsBySearchQuery(filterQuery) }
      }
    default:
      return { props: { pageTitle: 'ЕДНА Е МАЈКА?', products: [] } }
  }
}

type FilterPageProps = {
  pageTitle: string
  products: { producer: Producer; product: Product }[]
  producerInfo?: Producer
  categoryInfo?: Category
}

const FilterPage = (props: FilterPageProps) => {
  return (
    <>
      <Head>
        <title>{props.pageTitle}</title>
        <meta property="og:title" key="og:title" content={props.pageTitle} />
      </Head>
      <div>
        {props.producerInfo && <ProducerInfo producer={props.producerInfo} />}
        <ProductCardsGroup products={props.products} />
      </div>
    </>
  )
}

export default FilterPage
