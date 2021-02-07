import React, { useState, useEffect, useContext, createContext } from 'react'
import '@firebase/auth'
import { User as FirebaseUser, FirebaseAuth } from '@firebase/auth-types'
import { useFirebaseApp } from './firebase-context'

type AuthContextType = {
  user?: FirebaseUser
  signin: (email: string, password: string) => Promise<any>
  signup: (email: string, password: string) => Promise<any>
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
  const auth = useProvideAuth(firebaseApp.auth!!())

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

function useProvideAuth(firebaseAuth: FirebaseAuth): AuthContextType {
  const [user, setUser] = useState<FirebaseUser | undefined>()

  const signin = (email: string, password: string) => {
    return firebaseAuth.signInWithEmailAndPassword(email, password).then((response) => {
      setUser(response.user ?? undefined)
      return response.user
    })
  }

  const signup = (email: string, password: string) => {
    return firebaseAuth.createUserWithEmailAndPassword(email, password).then((response) => {
      setUser(response.user ?? undefined)
      user?.sendEmailVerification().catch((e) => console.error(e))
      return response.user
    })
  }

  const signout = () => {
    return firebaseAuth.signOut().then(() => setUser(undefined))
  }

  const sendPasswordResetEmail = (email: string) => {
    return firebaseAuth.sendPasswordResetEmail(email).then(() => true)
  }

  const confirmPasswordReset = (code: string, password: string) => {
    return firebaseAuth.confirmPasswordReset(code, password).then(() => true)
  }

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => setUser(user ?? undefined))
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
