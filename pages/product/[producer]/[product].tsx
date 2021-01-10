import 'swiper/swiper.min.css'
import 'swiper/components/navigation/navigation.min.css'
import 'swiper/components/pagination/pagination.min.css'
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header, Icon, Label } from 'semantic-ui-react'
import { ProducerInfo } from '../../../components/producer-info'
import { fetchProduct, fetchProductsWithProducers, fetchProducer, Producer, Product } from '../../../lib/products'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { isUndefined } from 'util'

SwiperCore.use([Navigation, Pagination])

type Params = {
  producer: string
  product: string
}

export const getStaticProps = async ({ params }: GetStaticPropsContext<Params>) => {
  const product = await fetchProduct(params!.producer, params!.product)
  const producer = await fetchProducer(params!.producer)
  return { props: { product, producer } }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = (await fetchProductsWithProducers()).map((params) => ({ params }))
  return { paths, fallback: false }
}

const ProductPage = ({ product, producer }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
      <div style={{ width: 400, margin: '0px 15px' }}>
        <Swiper navigation={product.images.length > 1} pagination={product.images.length > 1} id={'swiper-color'}>
          {product.images.map((url) => (
            <SwiperSlide key={url}>
              <Image src={url} width={400} height={400} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <Header>{product.title}</Header>
          <ProductCategories product={product} />
          <div dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
        </div>
        <ProducerInfo producer={producer} minimal />
      </div>
    </div>
  )
}

const ProductCategories = ({ product }: { product: Product }) => (
  <div style={{ marginTop: 8, marginBottom: 8 }}>
    {product.categories.map((category) => (
      <Link key={category.id} passHref href={{ pathname: '/filter', query: { category: category.id } }}>
        <Label as="a">{category.name}</Label>
      </Link>
    ))}
  </div>
)

export default ProductPage
