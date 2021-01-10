import 'semantic-ui-css/semantic.min.css'
import '../styles/globals.css'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/_app.module.css'
import { Menu, Dropdown, Input, Icon, Button, Image, Form } from 'semantic-ui-react'
import { Category, fetchCategories } from '../lib/categories'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import { useState } from 'react'

MyApp.getInitialProps = async () => {
  const categories = await fetchCategories()
  return { categories }
}

const generateCategoryItems = (categories: Category[], categoryContext: 'menu' | 'dropdown' = 'menu') => {
  return categories.map((category) => (
    <Link href={{ pathname: '/filter', query: { category: category.id } }}>
      {categoryContext === 'menu' ? (
        <Menu.Item>
          {category.name}
          {category.subcategories?.length ? (
            <Dropdown key={category.id}>
              <Dropdown.Menu>{generateCategoryItems(category.subcategories, 'dropdown')}</Dropdown.Menu>
            </Dropdown>
          ) : null}
        </Menu.Item>
      ) : (
        <Dropdown.Item>
          {category.name}
          {category.subcategories?.length ? (
            <Dropdown key={category.id}>
              <Dropdown.Menu>{generateCategoryItems(category.subcategories, 'dropdown')}</Dropdown.Menu>
            </Dropdown>
          ) : null}
        </Dropdown.Item>
      )}
    </Link>
  ))
}

function MyApp(appProps: AppProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>ЕДНА Е МАЈКА</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.header}>
        <Link href="/" passHref>
          <Image spaced src={'/logo.jpeg'} size="tiny" />
        </Link>
        <Form onSubmit={() => searchTerm && router.push({ pathname: '/filter', query: { search: searchTerm } })}>
          <Form.Input
            className={styles.search}
            placeholder={'Search...'}
            onChange={(args) => setSearchTerm(args.target.value)}
            value={searchTerm}
            icon={<Icon name="search" type="submit" />}
          />
        </Form>
      </div>
      <Menu borderless>{generateCategoryItems(appProps.categories)}</Menu>
      <appProps.Component {...appProps.pageProps} />
    </div>
  )
}

export default MyApp
