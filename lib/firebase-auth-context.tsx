import React, { useState, useEffect, useContext, createContext } from 'react'
import { useFirebaseApp } from './firebase-context'
import firebase from 'firebase/app'
import 'firebase/auth'

type AuthContextType = {
  user?: firebase.User
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
  const auth = useProvideAuth(firebaseApp.auth!!())

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

function useProvideAuth(firebaseAuth: firebase.auth.Auth): AuthContextType {
  const [user, setUser] = useState<firebase.User | undefined>()

  const signin = (email: string, password: string) => {
    return firebaseAuth.signInWithEmailAndPassword(email, password).then((response) => {
      setUser(response.user ?? undefined)
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
