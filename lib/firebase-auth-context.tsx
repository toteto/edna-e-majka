import React, { useState, useEffect, useContext, createContext } from 'react'
import { useFirebaseApp } from './firebase-context'
import firebase from 'firebase/app'
import 'firebase/auth'

export type User = {
  id: string
  role?: 'admin'
  displayName: string
  email: string
  photoURL?: string
  stores: string[]
}

type AuthContextType = {
  user?: User | null
  signin: (email: string, password: string) => Promise<any>
  signup: (displayName: string, email: string, password: string) => Promise<any>
  signout: () => Promise<any>
  sendPasswordResetEmail: (email: string) => Promise<any>
  confirmPasswordReset: (code: string, password: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  signin: () => Promise.reject(new Error('stub')),
  signup: () => Promise.reject(new Error('stub')),
  signout: () => Promise.reject(new Error('stub')),
  sendPasswordResetEmail: () => Promise.reject(new Error('stub')),
  confirmPasswordReset: () => Promise.reject(new Error('stub'))
})

export const ProvideAuth: React.FC = ({ children }) => {
  const firebaseApp = useFirebaseApp()
  const auth = useProvideAuth(firebaseApp.firestore(), firebaseApp.auth())

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

function useProvideAuth(firestore: firebase.firestore.Firestore, firebaseAuth: firebase.auth.Auth): AuthContextType {
  const [authUser, setAuthUser] = useState<firebase.User | null | undefined>(undefined)
  const [user, setUser] = useState<User | null | undefined>()

  useEffect(() => {
    if (authUser == null) return setUser(authUser)

    const dispose = firestore
      .collection('users')
      .doc(authUser.uid)
      .onSnapshot((s) => {
        const userData = s.data()
        setUser({
          id: authUser.uid,
          role: userData?.role ?? undefined,
          displayName: authUser.displayName ?? authUser.email ?? '',
          email: authUser.email!,
          photoURL: authUser.photoURL!,
          stores: userData?.stores ?? []
        })
      })

    return dispose
  }, [authUser])

  const signin = (email: string, password: string) => {
    return firebaseAuth.signInWithEmailAndPassword(email, password).then((response) => {
      setAuthUser(response.user)
      return response.user
    })
  }

  const signup = (displayName: string, email: string, password: string) => {
    return firebaseAuth.createUserWithEmailAndPassword(email, password).then(async (response) => {
      await response.user?.sendEmailVerification().catch(console.error)
      await response.user?.updateProfile({ displayName }).catch(console.error)
    })
  }

  const signout = () => {
    return firebaseAuth.signOut().then(() => setAuthUser(null))
  }

  const sendPasswordResetEmail = (email: string) => {
    return firebaseAuth.sendPasswordResetEmail(email).then(() => true)
  }

  const confirmPasswordReset = (code: string, password: string) => {
    return firebaseAuth.confirmPasswordReset(code, password).then(() => true)
  }

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => setAuthUser(user))
    return () => unsubscribe()
  }, [])

  return {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset
  }
}
