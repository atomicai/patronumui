import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import GoogleIcon from './components/GoogleIcon'
import styles from './components/styles/Sign.module.css'

function SignUp() {
  const [message, setMessage] = useState<string>('')
  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  useEffect(() => {
    setMessage('')
  }, [emailRef.current?.value, passwordRef.current?.value])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      emailRef.current?.value === undefined ||
      passwordRef.current?.value === undefined
    )
      return

    createUserWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user
        navigate('/isearch')
        // ...
      })
      .catch((error: FirebaseError) => {
        setMessage(error.message)
      })
  }

  return (
    <section className={styles.section}>
      <h1 className={styles.header}>Sign up for Patronus</h1>

      {!!message.length && <div className={styles.message}>{message}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <p className={styles.labelContent}>Email</p>
          <input type="text" ref={emailRef} className={styles.input} />
        </label>

        <label className={styles.label}>
          <p className={styles.labelContent}>Password</p>
          <input
            type="password"
            ref={passwordRef}
            autoComplete="true"
            className={styles.input}
          />
        </label>

        <button className={styles.enabledButton}>Sign up</button>
      </form>

      <p className={styles.p}>
        Already have an account?{' '}
        <NavLink to={'/isignin'} className={styles.link}>
          <span>Sign in</span>
        </NavLink>
      </p>

      <GoogleIcon />
    </section>
  )
}

export default SignUp
