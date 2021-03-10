import firebase from 'firebase/app'
import { products as productsApi } from '.'
import { latinToCyrillic } from './util'

export function products(firebaseApp: firebase.app.App, query: string) {
  const fixedQuery = latinToCyrillic(query)
  return productsApi
    .getAll(firebaseApp)
    .then((allProducts) => allProducts.filter((p) => p.description.toUpperCase().search(fixedQuery) >= 0))
}
