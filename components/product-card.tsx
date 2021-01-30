import styles from './product-card.module.css'
import NextImage from 'next/image'
import Link from 'next/link'
import { Card, Header, Statistic, Menu, Icon } from 'semantic-ui-react'
import { Producer, Product } from '../lib/products'
import format from 'date-fns/format'
import { useState } from 'react'

export const ProductCard = ({ producer, product }: { producer: Producer; product: Product }) => {
  return (
    <Link passHref href={`/product/${producer.id}/${product.id}`}>
      <Card link key={`${producer.id}-${product.id}`}>
        <NextImage src={product.images[0]} width={256} height={192} objectFit="cover" />
        <Card.Content>
          <Card.Header>{product.title}</Card.Header>
          <Card.Meta>
            <span>Додадено {format(new Date(product.addedDate), 'dd.MM.yyyy')}</span>
          </Card.Meta>
          <Card.Description>{product.shortDescription}</Card.Description>
        </Card.Content>

        <Card.Content extra textAlign="center">
          <Header sub>ЦЕНА</Header>
          {product.price.map((p) => (
            <Statistic key={p.desc} size="mini" color="red" label={p.desc} value={p.cost + ' МКД'} />
          ))}
        </Card.Content>
        <Card.Content extra>
          <Link passHref href={`/filter/producer/${producer.id}`}>
            <a>
              <div className={'ui avatar image'}>
                <NextImage src={producer.avatar} width={28} height={28} objectFit="cover" />
              </div>
              {producer.name}
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
    producer: Producer
    product: Product
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
      <Card.Group className={styles.productCardGroup} centered doubling itemsPerRow={4}>
        {props.products
          .sort((p1, p2) => {
            const score =
              (sortType === 'alphabetical' && p1.product.title.localeCompare(p2.product.title, 'mk')) ||
              (sortType === 'date' &&
                new Date(p2.product.addedDate).getTime() - new Date(p1.product.addedDate).getTime()) ||
              (sortType === 'cost' &&
                Math.min(...p1.product.price.map((p) => p.cost)) - Math.min(...p2.product.price.map((p) => p.cost)))

            return score ? (sortDirection === 'ascending' ? score : -1 * score) : 0
          })
          .map((p) => (
            <ProductCard key={`${p.producer.id}-${p.product.id}`} {...p} />
          ))}
      </Card.Group>
    </div>
  )
}
