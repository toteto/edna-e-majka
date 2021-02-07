import { useState } from 'react'
import { Button, Form, Message, Modal } from 'semantic-ui-react'
import { useAuth } from '../lib/firebase-auth-context'
import { validateEmail } from '../lib/util'

export const SignUp = (props: { onSuccess: () => void }) => {
  const auth = useAuth()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      ?.signup(email, password)
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
      <Form.Button disabled={loading} positive>
        Потврди
      </Form.Button>
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
      <Form.Button disabled={loading} positive>
        Потврди
      </Form.Button>
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
      {!success && (
        <Form.Button disabled={loading} positive>
          Потврди
        </Form.Button>
      )}
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
      {authType === 'signin' && <Modal.Header>Најава</Modal.Header>}
      {authType === 'signup' && <Modal.Header>Регистрација</Modal.Header>}
      {authType === 'forgotten-password' && <Modal.Header>Ресетирање на лозинка</Modal.Header>}
      <Modal.Content>
        {authType === 'signin' && <SignIn onSuccess={() => setOpen(false)} />}
        {authType === 'signup' && <SignUp onSuccess={() => setOpen(false)} />}
        {authType === 'forgotten-password' && <ForgottenPassword onSuccess={() => {}} />}
      </Modal.Content>
      <Modal.Actions>
        {authType !== 'signin' && (
          <Button color="yellow" onClick={() => setAuthType('signin')}>
            Најва
          </Button>
        )}
        {authType !== 'signup' && (
          <Button color="yellow" onClick={() => setAuthType('signup')}>
            Регистрација
          </Button>
        )}
        {authType !== 'forgotten-password' && (
          <Button color="grey" onClick={() => setAuthType('forgotten-password')}>
            Заборавена лозинка
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  )
}
