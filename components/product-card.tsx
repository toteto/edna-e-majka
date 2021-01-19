import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Card, Icon, Image } from 'semantic-ui-react'
import { Producer, Product } from '../lib/products'
import format from 'date-fns/format'
import { useState } from 'react'
import { relative } from 'path'
import { PassThrough } from 'stream'

export const ProductCard = ({ producer, product }: { producer: Producer; product: Product }) => {
  const [imageIndex, setImageIndex] = useState(0)

  return (
    <Card link key={`card-${product.id}`}>
      <Link passHref href={`product/${producer.id}/${product.id}`}>
        <Image as="a" src={product.images[imageIndex]} centered />
      </Link>
      <Link passHref href={`product/${producer.id}/${product.id}`}>
        <Card.Content>
          <Card.Header>{product.title}</Card.Header>
          <Card.Meta>
            <span className="date">Додадено {format(new Date(product.addedDate), 'dd.MM.yyyy')}</span>
          </Card.Meta>
          <Card.Description>{product.shortDescription}</Card.Description>
        </Card.Content>
      </Link>

      <Link passHref href={{ pathname: '/filter', query: { producer: producer.id } }}>
        <Card.Content extra>
          <Image avatar src={producer.avatar} />
          <a>{producer.name}</a>
        </Card.Content>
      </Link>
    </Card>
  )
}

export const ProductCardsGroup = (props: { children: React.ReactNode }) => {
  return (
    <Card.Group doubling stackable centered>
      {props.children}
    </Card.Group>
  )
}
