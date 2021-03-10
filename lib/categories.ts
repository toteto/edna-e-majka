import firebase from 'firebase/app'
import 'firebase/firestore'

export type Category = {
  id: string
  title: string
}

export function get(firebaseApp: firebase.app.App, id: string): Promise<Category | null> {
  return getAll(firebaseApp).then((cs) => cs.find((c) => c.id === id) ?? null)
}

export function getAll(firebaseApp: firebase.app.App): Promise<Category[]> {
  return firebaseApp
    .firestore()
    .collection('misc')
    .doc('categories')
    .get()
    .then((s) => Object.entries(s.data() as any).map(([id, title]) => ({ id, title: title as string })))
}
