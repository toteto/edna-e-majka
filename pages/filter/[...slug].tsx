import { GetStaticProps, GetStaticPaths } from 'next'
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

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { params } = ctx
  const [filterType, filterQuery] = params!.slug as any

  switch (filterType) {
    case 'category':
      return { props: { products: await fetchProductsByCategory(filterQuery) } }
    case 'producer':
      const result = await fetchProductsByProducer(filterQuery)
      return { props: { products: result.products, producerInfo: result.producer } }
    case 'search':
      return { props: { products: await fetchProductsBySearchQuery(filterQuery) } }
    default:
      return { props: { products: [] } }
  }
}

// export const getServerSideProps: GetServerSideProps<FilterPageProps, { slug: [FilterType, string] }> = async (ctx) => {
//   const { params } = ctx

//   const [filterType, filterQuery] = params!.slug

//   console.log(filterType, filterQuery)

//   switch (filterType) {
//     case 'category':
//       return { props: { products: await fetchProductsByCategory(filterQuery) } }
//     case 'producer':
//       const result = await fetchProductsByProducer(filterQuery)
//       return { props: { products: result.products, producerInfo: result.producer } }
//     case 'search':
//       return { props: { products: await fetchProductsBySearchQuery(filterQuery) } }
//     default:
//       return { props: { products: [] } }
//   }
// }

type FilterPageProps = {
  products: { producer: Producer; product: Product }[]
  producerInfo?: Producer
  categoryInfo?: Category
}

const FilterPage = (props: FilterPageProps) => {
  return (
    <div>
      {props.producerInfo && <ProducerInfo producer={props.producerInfo} />}
      <ProductCardsGroup products={props.products} />
    </div>
  )
}

export default FilterPage
