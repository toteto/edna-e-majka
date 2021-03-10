import { createContext, useContext, useEffect, useRef } from 'react'
import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyDxVD88vytUHJ3dv8Dq9KP9Pil_dP4JLGI',
  authDomain: 'edna-e-majka.firebaseapp.com',
  projectId: 'edna-e-majka',
  storageBucket: 'edna-e-majka.appspot.com',
  messagingSenderId: '775290058986',
  appId: '1:775290058986:web:7fa1b96bf2c8b41a19bf93',
  measurementId: 'G-48G0SB72V7'
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
