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

MyApp.getInitialProps = async () => {
  const categories = await fetchCategories()
  return { categories }
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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <div className={styles.header}>
        <Link href="/" passHref>
          <Image className={styles.logo} src="/logo.png" />
        </Link>
        <Dropdown
          className={styles.categories}
          text="Категории"
          icon="angle down"
          options={appProps.categories.map((category: Category) => ({
            key: category.id,
            text: category.title,
            active: false,
            onClick: () => router.push(`/filter/category/${category.id}`)
          }))}
        />
        <Input
          className={styles.search}
          placeholder={'Пребарај сите производи'}
          onChange={(args) => setSearchTerm(args.target.value)}
          value={searchTerm}
          onKeyDown={(e: any) => e.code === 'Enter' && triggerProductSearch()}
          action={{ color: 'red', icon: 'search', content: 'Пребарај', onClick: triggerProductSearch }}
        />
      </div>
      <div style={{ flexGrow: 1 }}>
        <appProps.Component {...appProps.pageProps} />
      </div>
      <div className={styles.footer}>
        <div>
          <a className={styles.footerSocialIcon} href="https://www.facebook.com/ednaemajka.mk">
            <Icon link name="facebook" size="large" color="blue" />
          </a>
          <a className={styles.footerSocialIcon} href="https://m.me/ednaemajka.mk">
            <Icon link name="facebook messenger" size="large" color="blue" />
          </a>
          <a className={styles.footerSocialIcon} href="https://www.instagram.com/ednaemajka.mk/">
            <Icon link name="instagram" size="large" color="purple" />
          </a>
          <ContactModal>
            <div className={styles.footerSocialIcon} style={{ cursor: 'pointer' }}>
              <Image src="/favicon-32x32.png" inline style={{ width: 20, verticalAlign: 'middle', marginRight: 3 }} />
              Контакт
            </div>
          </ContactModal>
        </div>
        <div style={{ marginTop: 5 }}>
          © 2011 - 2021{' '}
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
