import firebase from 'firebase/app'
import { products as productsApi } from '.'
import { getFirebaseApp } from './firebase-context'
import { latinToCyrillic } from './util'

export function products(query: string, firebaseApp: firebase.app.App = getFirebaseApp()) {
  const fixedQuery = latinToCyrillic(query)
  return productsApi
    .getAll(firebaseApp)
    .then((allProducts) => allProducts.filter((p) => p.description.toUpperCase().search(fixedQuery) >= 0))
}
