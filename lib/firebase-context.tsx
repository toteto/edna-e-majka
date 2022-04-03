import { createContext, useContext, useEffect, useRef } from 'react'
import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'edna-e-majka.firebaseapp.com',
  projectId: 'edna-e-majka',
  storageBucket: 'edna-e-majka.appspot.com',
  messagingSenderId: '775290058986',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

export const getFirebaseApp = () =>
  firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app()

const FirebaseAppContext = createContext(getFirebaseApp())

export const FirebaseAppProvider: React.FC = ({ children }) => {
  const firebaseAppRef = useRef(firebase.app())

  useEffect(() => {
    firebaseAppRef.current.analytics() // initialize analytics
  }, [])

  return <FirebaseAppContext.Provider value={firebaseAppRef.current}>{children}</FirebaseAppContext.Provider>
}

export const useFirebaseApp = () => useContext(FirebaseAppContext)
