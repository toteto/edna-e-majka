import { GetServerSideProps } from 'next'
import { ProducerInfo } from '../components/producer-info'
import { ProductCard, ProductCardsGroup } from '../components/product-card'
import { Category } from '../lib/categories'
import {
  fetchProductsByCategory,
  fetchProductsByProducer,
  fetchProductsBySearchQuery,
  Producer,
  Product
} from '../lib/products'

export const getServerSideProps: GetServerSideProps<FilterPageProps> = async ({ query }) => {
  if (typeof query.category === 'string') {
    const products = await fetchProductsByCategory(query.category)
    return { props: { products } }
  }
  if (typeof query.producer === 'string') {
    const result = await fetchProductsByProducer(query.producer)
    return { props: { products: result.products, producerInfo: result.producer } }
  }
  if (typeof query.search === 'string') {
    const products = await fetchProductsBySearchQuery(query.search)
    return { props: { products } }
  }
  return { props: { products: [] } }
}

type FilterPageProps = {
  products: { producer: Producer; product: Product }[]
  producerInfo?: Producer
  categoryInfo?: Category
}

const FilterPage = (props: FilterPageProps) => {
  return (
    <div>
      {props.producerInfo && <ProducerInfo producer={props.producerInfo} />}
      <ProductCardsGroup>
        {props.products.map((p) => (
          <ProductCard key={`${p.producer.id}-${p.product.id}`} {...p} />
        ))}
      </ProductCardsGroup>
    </div>
  )
}

export default FilterPage
