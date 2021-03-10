import { categories } from '.'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { getFirebaseApp } from './firebase-context'

export type ProductVariant = {
  title: string
  price: number
}

export type Product = {
  id: string
  store: string
  title: string
  description: string
  categories: categories.Category[]
  images: string[]
  variants: ProductVariant[]
  created: number
}

function mapFirebaseProduct(refId: string, data: any): Product {
  return {
    ...data,
    id: refId,
    created: data.created?.toMillis()
  }
}

export function getAll(firebaseApp: firebase.app.App = getFirebaseApp()) {
  return firebaseApp
    .firestore()
    .collection('products')
    .get()
    .then((s) => s.docs.map((d) => mapFirebaseProduct(d.id, d.data())))
}

export function get(id: string, firebaseApp: firebase.app.App = getFirebaseApp()) {
  return firebaseApp
    .firestore()
    .collection('products')
    .doc(id)
    .get()
    .then((s) => mapFirebaseProduct(s.id, s.data()))
}

export function getMultiple(ids: string[], firebaseApp: firebase.app.App = getFirebaseApp()) {
  return firebaseApp
    .firestore()
    .collection('products')
    .where(firebase.firestore.FieldPath.documentId(), 'in', ids)
    .get()
    .then((s) => s.docs.map((d) => mapFirebaseProduct(d.id, d.data())))
}

export function getByCategory(
  category: string | categories.Category,
  firebaseApp: firebase.app.App = getFirebaseApp()
) {
  const categoryPromise = typeof category === 'string' ? categories.get(category) : Promise.resolve(category)

  return categoryPromise.then((c) =>
    firebaseApp
      .firestore()
      .collection('products')
      .where('categories', 'array-contains', c)
      .get()
      .then(({ docs }) => docs.map((d) => mapFirebaseProduct(d.id, d.data())))
  )
}

export function getByStore(store: string, firebaseApp: firebase.app.App = getFirebaseApp()) {
  return firebaseApp
    .firestore()
    .collection('products')
    .where('store', '==', store)
    .get()
    .then(({ docs }) => docs.map((d) => mapFirebaseProduct(d.id, d.data())))
}

export function liveProductsForStore(
  storeId: string,
  onChange: (products: Product[]) => void,
  firebaseApp: firebase.app.App = getFirebaseApp()
) {
  const unsub = firebaseApp
    .firestore()
    .collection('products')
    .where('store', '==', storeId)
    .onSnapshot(({ docs }) => onChange(docs.map((d) => mapFirebaseProduct(d.id, d.data()))))
  return unsub
}
