import styles from './producer-info.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { Header, Icon, Label, Segment, Container } from 'semantic-ui-react'
import { Producer } from '../lib/products'

export const ProducerInfo = ({ producer, minimal }: { producer: Producer; minimal?: boolean }) => (
  <div className={styles.container}>
    <Segment>
      <div className={styles.innerContainer}>
        <Link passHref href={{ pathname: '/filter', query: { producer: producer.id } }}>
          <Header>
            <div className={'ui avatar image'}>
              <Image src={producer.avatar} width={minimal ? 28 : 32} height={minimal ? 28 : 32} objectFit="cover" />
            </div>
            {producer.name}
          </Header>
        </Link>
        <div dangerouslySetInnerHTML={{ __html: producer.desc }} />
        <Header size="small">Контакт:</Header>
        <div>
          {producer.contact.phone && <PhoneContactLabel phone={producer.contact.phone} />}
          {producer.contact.facebook && <FacebookContactLabel url={producer.contact.facebook} />}
          {producer.contact.instagram && <InstagramContactLabel url={producer.contact.instagram} />}
          {producer.contact.mail && <MailContactLabel mail={producer.contact.mail} />}
        </div>
      </div>
    </Segment>
  </div>
)

const PhoneContactLabel = (props: { phone: string }) => (
  <Label color="green">
    <Icon name="phone" /> {props.phone}
  </Label>
)

const InstagramContactLabel = (props: { url: string }) => (
  <Label as="a" href={props.url} color="purple">
    <Icon name="instagram" /> Instagram
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
