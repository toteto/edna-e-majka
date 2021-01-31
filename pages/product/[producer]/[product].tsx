import styles from '../../../styles/Product.module.css'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header, Label, Popup } from 'semantic-ui-react'
import { fetchProduct, fetchProductsWithProducers, fetchProducer, Producer, Product } from '../../../lib/products'
import { ProducerContactsLabels } from '../../../components/producer-info'
import Head from 'next/head'

type PathParams = {
  producer: string
  product: string
}

export const getStaticProps: GetStaticProps<ProductPageProps, PathParams> = async ({ params }) => {
  const product = await fetchProduct(params!.producer, params!.product)
  const producer = await fetchProducer(params!.producer)
  return { props: { product, producer } }
}

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const paths = (await fetchProductsWithProducers()).map((params) => ({ params }))
  return { paths, fallback: false }
}

type ProductPageProps = {
  product: Product
  producer: Producer
}

const ProductPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>{`${props.product.title} | ЕДНА Е МАЈКА`}</title>
        <meta property="og:title" key="og:title" content={`${props.product.title} | ЕДНА Е МАЈКА`} />
        <meta property="og:description" key="og:description" content={props.product.shortDescription} />
        <meta property="og:image" key="og:image" content={props.product.images[0]} />
      </Head>
      <div className={styles.container}>
        <ProductImages {...props} />
        <ProductDetails {...props} />
      </div>
    </>
  )
}

const ProductDetailsHeader = ({ product, producer }: { product: Product; producer: Producer }) => (
  <Header as="h1" dividing>
    <ProductCategories product={product} />
    {product.title}
    <Header.Subheader>
      <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
        <Link passHref href={`/filter/producer/${producer.id}`}>
          <a>
            <Popup
              position="bottom right"
              wide
              mouseEnterDelay={100}
              mouseLeaveDelay={500}
              openOnTriggerClick={false}
              trigger={
                <div style={{ float: 'left' }}>
                  {producer.name}
                  <div className={'ui avatar image spaced'}>
                    <Image priority src={producer.avatar} width={28} height={28} objectFit="cover" />
                  </div>
                </div>
              }
              content={<div dangerouslySetInnerHTML={{ __html: producer.desc }} />}
            />
          </a>
        </Link>
        <ProducerContactsLabels producer={producer} />
      </div>
    </Header.Subheader>
  </Header>
)

const ProductDetails = (props: { product: Product; producer: Producer }) => (
  <div className={styles.productDetailsContainer}>
    <ProductDetailsHeader {...props} />
    <div dangerouslySetInnerHTML={{ __html: props.product.fullDescription }} />
  </div>
)

const ProductImages = ({ product }: { product: Product }) => (
  <div className={styles.productImagesContainer}>
    {product.images.map((url, index) => (
      <div key={url} className={'ui spaced rounded image ' + styles.productImage}>
        <Image priority={index === 0} src={url} width={512} height={384} objectFit="cover" />
      </div>
    ))}
  </div>
)

const ProductCategories = ({ product }: { product: Product }) => (
  <Label.Group size="small">
    {product.categories.map((category) => (
      <Link key={category.id} passHref href={`/filter/category/${category.id}`}>
        <Label as="a">{category.title}</Label>
      </Link>
    ))}
  </Label.Group>
)

export default ProductPage
