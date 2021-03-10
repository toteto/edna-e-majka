import firebase from 'firebase/app'
import 'firebase/firestore'
import { getFirebaseApp } from './firebase-context'

export type Category = {
  id: string
  title: string
}

export function get(id: string, firebaseApp: firebase.app.App = getFirebaseApp()): Promise<Category | null> {
  return getAll(firebaseApp).then((cs) => cs.find((c) => c.id === id) ?? null)
}

export function getAll(firebaseApp: firebase.app.App = getFirebaseApp()): Promise<Category[]> {
  return firebaseApp
    .firestore()
    .collection('misc')
    .doc('categories')
    .get()
    .then((s) => Object.entries(s.data() as any).map(([id, title]) => ({ id, title: title as string })))
}
