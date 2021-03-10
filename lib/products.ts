import { categories } from '.'
import firebase from 'firebase/app'
import 'firebase/firestore'

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

export function getAll(firebaseApp: firebase.app.App) {
  return firebaseApp
    .firestore()
    .collection('products')
    .get()
    .then((s) => s.docs.map((d) => mapFirebaseProduct(d.id, d.data())))
}

export function get(firebaseApp: firebase.app.App, id: string) {
  return firebaseApp
    .firestore()
    .collection('products')
    .doc(id)
    .get()
    .then((s) => mapFirebaseProduct(s.id, s.data()))
}

export function getMultiple(firebaseApp: firebase.app.App, ids: string[]) {
  return firebaseApp
    .firestore()
    .collection('products')
    .where(firebase.firestore.FieldPath.documentId(), 'in', ids)
    .get()
    .then((s) => s.docs.map((d) => mapFirebaseProduct(d.id, d.data())))
}

export function getByCategory(firebaseApp: firebase.app.App, category: string | categories.Category) {
  const categoryPromise =
    typeof category === 'string' ? categories.get(firebaseApp, category) : Promise.resolve(category)

  return categoryPromise.then((c) =>
    firebaseApp
      .firestore()
      .collection('products')
      .where('categories', 'array-contains', c)
      .get()
      .then(({ docs }) => docs.map((d) => mapFirebaseProduct(d.id, d.data())))
  )
}

export function getByStore(firebaseApp: firebase.app.App, store: string) {
  return firebaseApp
    .firestore()
    .collection('products')
    .where('store', '==', store)
    .get()
    .then(({ docs }) => docs.map((d) => mapFirebaseProduct(d.id, d.data())))
}

export function liveProductsForStore(
  firebaseApp: firebase.app.App,
  storeId: string,
  onChange: (products: Product[]) => void
) {
  const unsub = firebaseApp
    .firestore()
    .collection('products')
    .where('store', '==', storeId)
    .onSnapshot(({ docs }) => onChange(docs.map((d) => mapFirebaseProduct(d.id, d.data()))))
  return unsub
}
