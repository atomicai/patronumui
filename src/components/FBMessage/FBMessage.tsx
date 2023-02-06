import { FC, useEffect, useState } from 'react'
import styles from './FBMessage.module.css'

interface FBMessageProps {
  errorCode: string
}

const FBMessage: FC<FBMessageProps> = ({ errorCode }) => {
  const [content, setContent] = useState<string>('')

  useEffect(() => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        setContent('Email already in use. Try again')
        break
      case 'auth/invalid-email':
        setContent('Invalid email. Try again')
        break
      case 'auth/user-not-found':
        setContent('User not found. Try again')
        break
      case 'auth/wrong-password':
        setContent('Incorrect password. Try again')
        break
      case 'auth/weak-password':
        setContent('Week password. Try again')
        break
      default:
        setContent('Something went wrong. We are working on it')
        break
    }
  }, [])

  return <div className={styles.content}>{content}</div>
}

export default FBMessage
