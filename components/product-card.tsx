import styles from './product-card.module.css'
import NextImage from 'next/image'
import Link from 'next/link'
import { Card } from 'semantic-ui-react'
import { Producer, Product } from '../lib/products'
import format from 'date-fns/format'

export const ProductCard = ({ producer, product }: { producer: Producer; product: Product }) => {
  return (
    <Link passHref href={`product/${producer.id}/${product.id}`}>
      <Card link key={`${producer.id}-${product.id}`}>
        <NextImage src={product.images[0]} width={256} height={192} objectFit="cover" />
        <Card.Content>
          <Card.Header>{product.title}</Card.Header>
          <Card.Meta>
            <span>Додадено {format(new Date(product.addedDate), 'dd.MM.yyyy')}</span>
          </Card.Meta>
          <Card.Description>{product.shortDescription}</Card.Description>
        </Card.Content>

        <Card.Content extra>
          <Link passHref href={{ pathname: '/filter', query: { producer: producer.id } }}>
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

export const ProductCardsGroup = (props: { children: React.ReactNode }) => (
  <Card.Group className={styles.productCardGroup} centered doubling itemsPerRow={4}>
    {props.children}
  </Card.Group>
)
