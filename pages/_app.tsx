import 'semantic-ui-css/semantic.min.css'
import '../styles/globals.css'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/_app.module.css'
import { Dropdown, Input, Image, Icon, Button } from 'semantic-ui-react'
import { Category, fetchCategories } from '../lib/categories'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import { useState } from 'react'
import { ContactModal } from '../components/contact-modal'
import { fetchProducers, Producer } from '../lib/products'

MyApp.getInitialProps = async () => {
  const categories = await fetchCategories()
  const producers = (await fetchProducers()).sort((a, b) => a.name.localeCompare(b.name))
  return { categories, producers }
}

function MyApp(appProps: AppProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const router = useRouter()

  const triggerProductSearch = () => {
    if (searchTerm) {
      router.push(`/filter/search/${searchTerm}`)
    }
  }

  return (
    <div className={styles.appContainer}>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ЕДНА Е МАЈКА" />
        <meta property="og:title" key="og:title" content="ЕДНА Е МАЈКА" />
        <meta property="og:description" key="og:description" content="Тука се сите домашни производи." />
        <meta property="og:image" key="og:image" content="/edna-e-majka-og.jpg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <div className={styles.header}>
        <Link href="/" passHref>
          <Image className={styles.logo} src="/logo.png" />
        </Link>
        <div>
          <Dropdown
            className={styles.headerDropdown}
            text="Производители"
            icon="angle down"
            options={appProps.producers.map((producer: Producer) => ({
              key: producer.id,
              text: producer.name,
              active: false,
              onClick: () => router.push(`/filter/producer/${producer.id}`)
            }))}
          />
          <Dropdown
            className={styles.headerDropdown}
            text="Категории"
            icon="angle down"
            options={appProps.categories.map((category: Category) => ({
              key: category.id,
              text: category.title,
              active: false,
              onClick: () => router.push(`/filter/category/${category.id}`)
            }))}
          />
        </div>
        <Input
          className={styles.search}
          placeholder={'Пребарај сите производи'}
          onChange={(args) => setSearchTerm(args.target.value)}
          value={searchTerm}
          onKeyDown={(e: any) => e.code === 'Enter' && triggerProductSearch()}
          action={{ color: 'red', icon: 'search', content: 'Пребарај', onClick: triggerProductSearch }}
        />
        <div>
          <a className={styles.headerSocialIcon} href="https://www.facebook.com/ednaemajka.mk">
            <Icon link name="facebook" size="large" color="blue" />
          </a>
          <a className={styles.headerSocialIcon} href="https://m.me/ednaemajka.mk">
            <Icon link name="facebook messenger" size="large" color="blue" />
          </a>
          <a className={styles.headerSocialIcon} href="https://www.instagram.com/ednaemajka.mk/">
            <Icon link name="instagram" size="large" color="purple" />
          </a>
          <ContactModal>
            <div className={styles.headerSocialIcon} style={{ cursor: 'pointer' }}>
              <Image src="/favicon-32x32.png" inline style={{ width: 20, verticalAlign: 'middle', marginRight: 3 }} />
              Контакт
            </div>
          </ContactModal>
        </div>
      </div>
      <div style={{ flexGrow: 1 }}>
        <appProps.Component {...appProps.pageProps} />
      </div>
      <div className={styles.footer}>
        <div style={{ marginTop: 5 }}>
          © 2021{' '}
          <Link href="/" passHref>
            <a>ednaemajka.mk</a>
          </Link>
          <span>. Сите права задржани.</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <span>Направено со </span>
          <Icon name="heart" color="red" />
        </div>
      </div>
    </div>
  )
}

export default MyApp
