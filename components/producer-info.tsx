import styles from './producer-info.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { Header, Icon, Label, Segment, Container } from 'semantic-ui-react'
import { stores } from '../lib'

export const ProducerInfo = ({ store, minimal }: { store: stores.Store; minimal?: boolean }) => (
  <div className={styles.container}>
    <Segment>
      <div className={styles.innerContainer}>
        <Link passHref href={`/filter/store/${store.id}`}>
          <Header>
            <div className={'ui avatar image'}>
              <Image src={store.avatar} width={minimal ? 28 : 32} height={minimal ? 28 : 32} objectFit="cover" />
            </div>
            {store.name}
          </Header>
        </Link>
        <p style={{ whiteSpace: 'pre-wrap' }}>{store.description}</p>
        <Header size="small">
          Контакт:
          <ProducerContactsLabels store={store} />
        </Header>
      </div>
    </Segment>
  </div>
)

export const ProducerContactsLabels = ({ store }: { store: stores.Store }) => (
  <div className={styles.producerContactsLabelsContainer}>
    {store.contact.phone && (
      <div className={styles.producerContactLabel}>
        <PhoneContactLabel phone={store.contact.phone} />
      </div>
    )}
    {store.contact.facebook && (
      <div className={styles.producerContactLabel}>
        <FacebookContactLabel url={store.contact.facebook} />
      </div>
    )}
    {store.contact.instagram && (
      <div className={styles.producerContactLabel}>
        <InstagramContactLabel url={store.contact.instagram} />
      </div>
    )}
    {store.contact.email && (
      <div className={styles.producerContactLabel}>
        <MailContactLabel mail={store.contact.email} />
      </div>
    )}
  </div>
)

const PhoneContactLabel = (props: { phone: string }) => (
  <Label color="green">
    <Icon name="phone" /> {props.phone}
  </Label>
)

const InstagramContactLabel = (props: { url: string }) => (
  <Label as="a" href={props.url} color="purple" className={styles.producerContactLabel}>
    <Icon name="instagram" /> Instagram
  </Label>
)

const FacebookContactLabel = (props: { url: string }) => (
  <Label as="a" href={props.url} color="blue" className={styles.producerContactLabel}>
    <Icon name="facebook" /> Facebook
  </Label>
)

const MailContactLabel = (props: { mail: string }) => (
  <Label as="a" href={`mailto:${props.mail}`} color="red" className={styles.producerContactLabel}>
    <Icon name="mail" /> {props.mail}
  </Label>
)
