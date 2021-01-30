import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { fetchProducer, fetchProduct, fetchProductsWithProducers, Producer, Product } from '../lib/products'
import { ProductCardsGroup } from '../components/product-card'

export const getStaticProps = async (_context: GetStaticPropsContext) => {
  const ids = await fetchProductsWithProducers()
  const allProducts: { producer: Producer; product: Product }[] = []
  for (const pair of ids) {
    const producer = await fetchProducer(pair.producer)
    const product = await fetchProduct(pair.producer, pair.product)
    allProducts.push({ producer, product })
  }

  return {
    props: {
      allProducts
    }
  }
}

const Home = ({ allProducts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <ProductCardsGroup products={allProducts} />
}

export default Home
