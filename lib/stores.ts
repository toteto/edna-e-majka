import firebase from 'firebase/app'
import 'firebase/firestore'
import { getFirebaseApp } from './firebase-context'

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
    modified: data.modified?.toMillis() ?? null,
    avatar: data.avatar ?? '/assets/avatar-placeholder.jpg',
    status: data.status ?? 'disabled'
  }
}

export function get(id: string, firebaseApp: firebase.app.App = getFirebaseApp()) {
  return firebaseApp
    .firestore()
    .collection('stores')
    .doc(id)
    .get()
    .then((s) => mapFirebaseStore(s.id, s.data()))
}

export function getMultiple(ids: string[], firebaseApp: firebase.app.App = getFirebaseApp()) {
  return firebaseApp
    .firestore()
    .collection('stores')
    .where(firebase.firestore.FieldPath.documentId(), 'in', ids)
    .get()
    .then((s) => s.docs.map((d) => mapFirebaseStore(d.id, d.data())))
}

export function getAll(firebaseApp: firebase.app.App = getFirebaseApp()) {
  return firebaseApp
    .firestore()
    .collection('stores')
    .get()
    .then((s) => s.docs.map((d) => mapFirebaseStore(d.id, d.data())))
}
