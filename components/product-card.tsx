import styles from './product-card.module.css'
import NextImage from 'next/image'
import Link from 'next/link'
import { Card, Header, Statistic, Menu, Icon, Image } from 'semantic-ui-react'
import format from 'date-fns/format'
import { useState } from 'react'
import { products, stores } from '../lib'
import { truncate } from '../lib/util'

export const ProductCard = ({ store, product }: { store: stores.Store; product: products.Product }) => {
  return (
    <Link passHref href={`/product/${product.id}`}>
      <Card fluid color="yellow" key={`${store.id}-${product.id}`} style={{ margin: 0 }}>
        <NextImage src={product.images[0]} width={300} height={225} objectFit="cover" />
        <Card.Content>
          <Card.Header>{product.title}</Card.Header>
          <Card.Meta>
            <span>Додадено {format(new Date(product.created), 'dd.MM.yyyy')}</span>
          </Card.Meta>
          <Card.Description>{truncate(product.description, 123)}</Card.Description>
        </Card.Content>

        <Card.Content extra textAlign="center">
          <Header sub>ЦЕНА</Header>
          {product.variants.map((p) => (
            <Statistic key={p.title} size="mini" color="red" label={p.title} value={p.price + ' МКД'} />
          ))}
        </Card.Content>
        <Card.Content extra>
          <Link passHref href={`/filter/store/${store.id}`}>
            <a>
              <div className={'ui avatar image'}>
                <NextImage src={store.avatar} width={28} height={28} objectFit="cover" />
              </div>
              {store.name}
            </a>
          </Link>
        </Card.Content>
      </Card>
    </Link>
  )
}

type OrderDirectionType = 'descending' | 'ascending'
const orderAlphabetical = 'alphabetical'
const orderNewest = 'date'
const orderCost = 'cost'

export const ProductCardsGroup = (props: {
  products: {
    store: stores.Store
    product: products.Product
  }[]
}) => {
  const [sortDirection, setOrderDirection] = useState<OrderDirectionType>('ascending')
  const [sortType, setOrder] = useState(orderNewest)

  const handleOrderClick = (_: any, { name }: { name?: string }) => setOrder(name ?? orderNewest)
  return (
    <div>
      <Menu fluid text stackable size="large">
        <Menu.Item header>
          <span>Подредување</span>
          <Icon
            style={{ paddingLeft: 5, paddingRight: 5 }}
            link
            name={sortDirection === 'ascending' ? 'sort amount down' : 'sort amount up'}
            onClick={() =>
              sortDirection === 'ascending' ? setOrderDirection('descending') : setOrderDirection('ascending')
            }
          />
        </Menu.Item>
        <Menu.Item name={orderNewest} active={sortType === orderNewest} onClick={handleOrderClick}>
          Најново
        </Menu.Item>
        <Menu.Item name={orderAlphabetical} active={sortType === orderAlphabetical} onClick={handleOrderClick}>
          Азбучен редослед
        </Menu.Item>
        <Menu.Item name={orderCost} active={sortType === orderCost} onClick={handleOrderClick}>
          Цена
        </Menu.Item>
      </Menu>
      <div className={styles.productCardGroup}>
        {props.products
          .sort((p1, p2) => {
            const score =
              (sortType === 'alphabetical' && p1.product.title.localeCompare(p2.product.title, 'mk')) ||
              (sortType === 'date' && p2.product.created - p1.product.created) ||
              (sortType === 'cost' &&
                Math.min(...p1.product.variants.map((p) => p.price)) -
                  Math.min(...p2.product.variants.map((p) => p.price)))

            return score ? (sortDirection === 'ascending' ? score : -1 * score) : 0
          })
          .map((p) => (
            <ProductCard key={`${p.store.id}-${p.product.id}`} {...p} />
          ))}
      </div>
    </div>
  )
}
