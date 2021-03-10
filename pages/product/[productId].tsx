import styles from '../../styles/Product.module.css'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header, Label, Popup, Statistic } from 'semantic-ui-react'
import { ProducerContactsLabels } from '../../components/producer-info'
import Head from 'next/head'
import firebase from 'firebase/app'
import { products, stores } from '../../lib'
import { truncate } from '../../lib/util'

type PathParams = {
  productId: string
}

type ProductPageProps = {
  product: products.Product
  store: stores.Store
}

export const getStaticProps: GetStaticProps<ProductPageProps, PathParams> = async ({ params }) => {
  if (params?.productId == null) throw new Error('Invalid params for product page!')

  const firebaseApp = firebase.app()
  const product = await products.get(firebaseApp, params.productId)
  const store = await stores.get(firebaseApp, product.store)
  return { props: { product, store } }
}

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const paths = await products
    .getAll(firebase.app())
    .then((products) => products.map((p) => ({ params: { productId: p.id } })))

  return { paths, fallback: false }
}

const ProductPage = (props: ProductPageProps) => {
  return (
    <>
      <Head>
        <title>{`${props.product.title} | ЕДНА Е МАЈКА`}</title>
        <meta property="og:title" key="og:title" content={`${props.product.title} | ЕДНА Е МАЈКА`} />
        <meta property="og:description" key="og:description" content={props.product.description} />
        <meta property="og:image" key="og:image" content={props.product.images[0]} />
      </Head>
      <div className={styles.container}>
        <ProductImages images={props.product.images} />
        <ProductDetails {...props} />
      </div>
    </>
  )
}

const ProductDetailsHeader = ({ product, store }: ProductPageProps) => (
  <Header as="h1" dividing>
    <ProductCategories product={product} />
    {product.title}
    <Header.Subheader>
      <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
        <Link passHref href={`/filter/store/${store.id}`}>
          <a>
            <Popup
              position="bottom right"
              wide
              mouseEnterDelay={100}
              mouseLeaveDelay={500}
              openOnTriggerClick={false}
              trigger={
                <div style={{ float: 'left' }}>
                  {store.name}
                  <div className={'ui avatar image spaced'}>
                    <Image priority src={store.avatar} width={28} height={28} objectFit="cover" />
                  </div>
                </div>
              }
              content={<p style={{ whiteSpace: 'pre-wrap' }}>{truncate(store.description, 256)}</p>}
            />
          </a>
        </Link>
      </div>
    </Header.Subheader>
  </Header>
)

const ProductDetails = (props: { product: products.Product; store: stores.Store }) => (
  <div className={styles.productDetailsContainer}>
    <ProductDetailsHeader {...props} />
    <p style={{ whiteSpace: 'pre-wrap' }}>{props.product.description}</p>
    <Header
      as="h4"
      content="Цена:"
      subheader={
        <Statistic.Group size="tiny">
          {props.product.variants.map((p) => (
            <Statistic key={p.title} color="red" label={p.title} value={p.price + ' МКД'} />
          ))}
        </Statistic.Group>
      }
    />
    <Header
      as="h4"
      content={`Нарачај "${props.product.title}" од ${props.store.name} преку:`}
      subheader={
        <div style={{ padding: '10px 0px' }}>
          <ProducerContactsLabels store={props.store} />
        </div>
      }
    />
  </div>
)

const ProductImages = ({ images }: { images: string[] }) => (
  <div className={styles.productImagesContainer}>
    {images.map((url, index) => (
      <div key={url} className={'ui spaced rounded image ' + styles.productImage}>
        <Image priority={index === 0} src={url} width={512} height={384} objectFit="cover" />
      </div>
    ))}
  </div>
)

const ProductCategories = ({ product }: { product: products.Product }) => (
  <Label.Group size="small">
    {product.categories.map((category) => (
      <Link key={category.id} passHref href={`/filter/category/${category.id}`}>
        <Label as="a">{category.title}</Label>
      </Link>
    ))}
  </Label.Group>
)

export default ProductPage
