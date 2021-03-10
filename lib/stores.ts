import firebase from 'firebase/app'
import 'firebase/firestore'

export type Store = {
  id: string
  name: string
  description: string
  avatar: string
  contact: {
    phone?: string
    facebook?: string
    instagram?: string
    email?: string
  }
  status: 'enabled' | 'disabled'
  created: number
  modified?: number
}

function mapFirebaseStore(refId: string, data: any): Store {
  return {
    ...data,
    id: refId,
    created: data.created.toMillis(),
    modified: data.modified?.toMillis(),
    avatar: data.avatar ?? '/assets/avatar-placeholder.jpg',
    status: data.status ?? 'disabled'
  }
}

export function get(firebaseApp: firebase.app.App, id: string) {
  return firebaseApp
    .firestore()
    .collection('stores')
    .doc(id)
    .get()
    .then((s) => mapFirebaseStore(s.id, s.data()))
}

export function getMultiple(firebaseApp: firebase.app.App, ids: string[]) {
  return firebaseApp
    .firestore()
    .collection('stores')
    .where(firebase.firestore.FieldPath.documentId(), 'in', ids)
    .get()
    .then((s) => s.docs.map((d) => mapFirebaseStore(d.id, d.data())))
}

export function getAll(firebaseApp: firebase.app.App) {
  return firebaseApp
    .firestore()
    .collection('stores')
    .get()
    .then((s) => s.docs.map((d) => mapFirebaseStore(d.id, d.data())))
}
