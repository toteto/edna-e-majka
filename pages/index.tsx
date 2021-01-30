import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { fetchProducer, fetchProduct, fetchProductsWithProducers, Producer, Product } from '../lib/products'
import { ProductCardsGroup } from '../components/product-card'
import { Message } from 'semantic-ui-react'
import { ContactModal } from '../components/contact-modal'

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
  return (
    <div>
      <Message style={{ margin: 10 }}>
        <Message.Header>Добредојдовте на ЕДНА Е МАЈКА</Message.Header>
        <p>
          „Една е мајка“ е онлајн платоформа која служи како огласник за домашни производи. Тука индивидуални
          произведувачи на домашни производи со висок квалитет ги објавуваат своите производи, додека купувачите на
          лесен и прегледен начин имаат пристап на истите.
        </p>
        <p>
          Користењето на платформата е бесплатно за сите, нема никакви трошоци ни за огласување на производите, ниту за
          купување на истите.
        </p>
        <p>
          <span>
            Доколку сте производител и сакате да огласите вашите производи или сакате да видите производите на вашиот
            омилен производител,
          </span>
          <ContactModal>
            <a href="#" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              {' '}
              контактирајте нѐ.
            </a>
          </ContactModal>
        </p>
      </Message>
      <ProductCardsGroup products={allProducts} />
    </div>
  )
}

export default Home
