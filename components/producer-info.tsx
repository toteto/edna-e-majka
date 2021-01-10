import Link from 'next/link'
import { Image, Header, Icon, Label, Segment, Container } from 'semantic-ui-react'
import { Producer } from '../lib/products'

export const ProducerInfo = ({ producer, minimal }: { producer: Producer; minimal?: boolean }) => (
  <Segment>
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
      <Link passHref href={{ pathname: '/filter', query: { producer: producer.id } }}>
        <Image spaced size={minimal ? 'tiny' : 'small'} src={producer.avatar} />
      </Link>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link passHref href={{ pathname: '/filter', query: { producer: producer.id } }}>
          <Header>{producer.name}</Header>
        </Link>
        <div dangerouslySetInnerHTML={{ __html: producer.desc }} />
        <Header size="small">Контакт:</Header>
        <div>
          {producer.contact.phone && <PhoneContactLabel phone={producer.contact.phone} />}
          {producer.contact.facebook && <FacebookContactLabel url={producer.contact.facebook} />}
          {producer.contact.mail && <MailContactLabel mail={producer.contact.mail} />}
        </div>
      </div>
    </div>
  </Segment>
)

const PhoneContactLabel = (props: { phone: string }) => (
  <Label color="green">
    <Icon name="phone" /> {props.phone}
  </Label>
)

const FacebookContactLabel = (props: { url: string }) => (
  <Label as="a" href={props.url} color="blue">
    <Icon name="facebook" /> Facebook
  </Label>
)

const MailContactLabel = (props: { mail: string }) => (
  <Label as="a" href={`mailto:${props.mail}`} color="red">
    <Icon name="mail" /> {props.mail}
  </Label>
)
