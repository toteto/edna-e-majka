import 'semantic-ui-css/semantic.min.css'
import '../styles/globals.css'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/_app.module.css'
import { Dropdown, Input, Image } from 'semantic-ui-react'
import { Category, fetchCategories } from '../lib/categories'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import { useState } from 'react'

MyApp.getInitialProps = async () => {
  const categories = await fetchCategories()
  return { categories }
}

function MyApp(appProps: AppProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const router = useRouter()

  const triggerProductSearch = () => {
    if (searchTerm) {
      router.push({ pathname: '/filter', query: { search: searchTerm } })
    }
  }

  return (
    <div className={styles.appContainer}>
      <Head>
        <title>ЕДНА Е МАЈКА</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.header}>
        <Link href="/" passHref>
          <Image className={styles.logo} src="/logo.jpeg" />
        </Link>
        <Dropdown
          className={styles.categories}
          text="Категории"
          icon="angle down"
          options={appProps.categories.map((category: Category) => ({
            key: category.id,
            text: category.name,
            active: false,
            onClick: () => router.push({ pathname: '/filter', query: { category: category.id } })
          }))}
        />
        <Input
          className={styles.search}
          placeholder={'Пребарај сите производи'}
          onChange={(args) => setSearchTerm(args.target.value)}
          value={searchTerm}
          onKeyDown={(e: any) => e.code === 'Enter' && triggerProductSearch()}
          action={{ icon: 'search', content: 'Пребарај', onClick: triggerProductSearch }}
        />
      </div>
      <appProps.Component {...appProps.pageProps} />
    </div>
  )
}

export default MyApp
