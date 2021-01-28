import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { fetchProducer, fetchProduct, fetchProductsWithProducers, Producer, Product } from '../lib/products'
import { ProductCard, ProductCardsGroup } from '../components/product-card'
import { Icon, Menu } from 'semantic-ui-react'
import { useState } from 'react'

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

type OrderDirectionType = 'descending' | 'ascending'
const orderAlphabetical = 'alphabetical'
const orderDate = 'date'

const Home = ({ allProducts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [sortDirection, setOrderDirection] = useState<OrderDirectionType>('descending')
  const [sortType, setOrder] = useState(orderDate)

  const handleOrderClick = (_: any, { name }: { name?: string }) => setOrder(name ?? orderDate)

  return (
    <div>
      <Menu fluid text stackable size="large">
        <Menu.Item header>
          <span>Подредување</span>
          <Icon
            style={{ paddingLeft: 5, paddingRight: 5 }}
            link
            name={sortDirection === 'descending' ? 'sort amount down' : 'sort amount up'}
            onClick={() =>
              sortDirection === 'descending' ? setOrderDirection('ascending') : setOrderDirection('descending')
            }
          />
        </Menu.Item>
        <Menu.Item name={orderDate} active={sortType === orderDate} onClick={handleOrderClick}>
          Последно додадени
        </Menu.Item>
        <Menu.Item name={orderAlphabetical} active={sortType === orderAlphabetical} onClick={handleOrderClick}>
          Азбучен редослед
        </Menu.Item>
      </Menu>
      <ProductCardsGroup>
        {allProducts
          .sort((p1, p2) => {
            const score =
              (sortType === 'alphabetical' && p1.product.title.localeCompare(p2.product.title, 'mk')) ||
              (sortType === 'date' &&
                new Date(p1.product.addedDate).getTime() - new Date(p2.product.addedDate).getTime())

            return score ? (sortDirection === 'ascending' ? score : -1 * score) : 0
          })
          .map((p) => (
            <ProductCard key={`${p.producer.id}-${p.product.id}`} {...p} />
          ))}
      </ProductCardsGroup>
    </div>
  )
}

export default Home
