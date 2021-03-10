import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { ProductCardsGroup } from '../components/product-card'
import { Image, Message } from 'semantic-ui-react'
import { ContactModal } from '../components/contact-modal'
import { categories, products, stores } from '../lib'
import Link from 'next/link'

export const getStaticProps = async (_context: GetStaticPropsContext) => {
  const allProducts = await products.getAll()
  const storeIds = allProducts.reduce(
    (storeIds: string[], p) => (storeIds.includes(p.store) ? storeIds : storeIds.concat(p.store)),
    []
  )
  const allStores = await stores.getMultiple(storeIds)
  const allCategories = await categories.getAll()

  return {
    props: {
      productCards: allProducts.map((product) => ({ product, store: allStores.find((s) => s.id === product.store)! })),
      categories: allCategories
    }
  }
}

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>ЕДНА Е МАЈКА</title>
      </Head>
      <div>
        <Message style={{ margin: 10 }}>
          <Message.Header>Добредојдовте на ЕДНА Е МАЈКА</Message.Header>
          <p>
            „Една е мајка“ е онлајн платоформа која служи како огласник за домашни производи. Тука индивидуални
            произведувачи на домашни производи со висок квалитет ги објавуваат своите производи, додека купувачите на
            лесен и прегледен начин имаат пристап на истите.
          </p>
          <p>
            Користењето на платформата е бесплатно за сите, нема никакви трошоци ни за огласување на производите, ниту
            за купување на истите.
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
        <div className={styles.categoryIcons}>
          {props.categories.map((c) => (
            <Link href={`/filter/category/${c.id}`}>
              <div key={c.id} className={styles.categoryIcon}>
                <Image centered src={`/assets/category-icons/${c.id}.svg`} size="tiny" />
                <p style={{ paddingTop: 5 }}>{c.title}</p>
              </div>
            </Link>
          ))}
        </div>
        <ProductCardsGroup products={props.productCards} />
      </div>
    </>
  )
}

export default Home
