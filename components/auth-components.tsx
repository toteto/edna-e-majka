import { useState } from 'react'
import { Button, Form, Icon, Message, Modal } from 'semantic-ui-react'
import { useAuth } from '../lib/firebase-auth-context'
import { validateEmail } from '../lib/util'

export const SignUp = (props: { onSuccess: () => void }) => {
  const auth = useAuth()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      setError('Имате внесено невалидна email адреса.')
      return
    }

    if (password.trim().length < 6) {
      return setError('Минимална должина на лозинката е 6 карактери.')
    }

    if (password !== passwordConfirmation) {
      return setError('Внесените лозинки не се поклопуваат. Обидете се повторно да ги внесите лозинките.')
    }

    setError('')
    setLoading(true)
    auth
      ?.signup(name, email, password)
      .then(() => {
        setLoading(false)
        props.onSuccess()
      })
      .catch((e) => {
        console.error(e)
        setError(e.message)
        setLoading(false)
      })
  }

  return (
    <Form loading={auth == null || loading} error={error.length > 0} onSubmit={handleSubmit}>
      <Form.Input
        fluid
        label="Име и презиме"
        placeholder="Вашето име и презиме"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Form.Input
        fluid
        label="Електронска Пошта"
        placeholder="Вашата адреса за електронска пошта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Form.Input
        fluid
        type="password"
        label="Лозинка"
        placeholder="Безбедна лозинка"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Form.Input
        fluid
        type="password"
        label="Поворете ја лозинката"
        placeholder="Истата лозинка"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
      />
      <Message error header="Грешка при регистрација" content={error} />
      <Form.Button fluid disabled={loading} positive icon="check" content="Потврди" />
    </Form>
  )
}

export const SignIn = (props: { onSuccess: () => void }) => {
  const auth = useAuth()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    setError('')
    setLoading(true)
    auth
      ?.signin(email, password)
      .then(() => props.onSuccess())
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  return (
    <Form loading={auth == null || loading} error={error.length > 0} onSubmit={handleSubmit}>
      <Form.Input
        fluid
        label="Електронска Пошта"
        placeholder="Вашата адреса за електронска пошта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Form.Input
        fluid
        type="password"
        label="Лозинка"
        placeholder="Вашата лозинка"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Message error header="Грешка при најава" content={error} />
      <Form.Button fluid disabled={loading} positive icon="check" content="Потврди" />
    </Form>
  )
}

const ForgottenPassword = (props: { onSuccess: () => void }) => {
  const auth = useAuth()

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    setError('')
    setLoading(true)
    auth
      ?.sendPasswordResetEmail(email)
      .then(() => {
        setSuccess(true)
        setLoading(false)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  return (
    <Form loading={auth == null || loading} error={error.length > 0} success={success} onSubmit={handleSubmit}>
      <Form.Input
        fluid
        label="Електронска Пошта"
        placeholder="Вашата адреса за електронска пошта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={success}
      />
      <Message error header="Грешка при ресетирање на лозинка" content={error} />
      <Message
        success
        header="Потврда за ресетирање на лозинка е испратена на вашата електронска пошта."
        content={error}
      />
      {!success && <Form.Button fluid disabled={loading} positive icon="check" content="Потврди" />}
    </Form>
  )
}

export const AuthModal = (props: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [authType, setAuthType] = useState<'signin' | 'signup' | 'forgotten-password'>('signin')

  return (
    <Modal
      size="tiny"
      trigger={props.children}
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      {authType === 'signin' && (
        <Modal.Header>
          <Icon name="sign-in" />
          Најава
        </Modal.Header>
      )}
      {authType === 'signup' && (
        <Modal.Header>
          <Icon name="signup" />
          Регистрација
        </Modal.Header>
      )}
      {authType === 'forgotten-password' && (
        <Modal.Header>
          <Icon name="question circle" />
          Ресетирање на лозинка
        </Modal.Header>
      )}
      <Modal.Content>
        {authType === 'signin' && <SignIn onSuccess={() => setOpen(false)} />}
        {authType === 'signup' && <SignUp onSuccess={() => setOpen(false)} />}
        {authType === 'forgotten-password' && <ForgottenPassword onSuccess={() => {}} />}
      </Modal.Content>
      <Modal.Actions>
        {authType !== 'signin' && (
          <Button color="yellow" icon="sign-in" onClick={() => setAuthType('signin')} content="Најава" />
        )}
        {authType !== 'signup' && (
          <Button color="yellow" icon="signup" onClick={() => setAuthType('signup')} content="Регистрација" />
        )}
        {authType !== 'forgotten-password' && (
          <Button
            color="grey"
            icon="question circle"
            onClick={() => setAuthType('forgotten-password')}
            content="Заборавена лозинка"
          />
        )}
      </Modal.Actions>
    </Modal>
  )
}
