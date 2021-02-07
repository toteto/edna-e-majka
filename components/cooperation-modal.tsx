import { useState } from 'react'
import { Modal, Form, Button } from 'semantic-ui-react'
import { validateEmail } from '../lib/util'

export const CooperationContactModal = (props: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [message, setMessage] = useState('')

  return (
    <Modal
      size="small"
      trigger={props.children}
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>Соработка</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            Пишете ни преку формата или е-маил на <a href="mailto://sorabotka@ednaemajka.mk">sorabotka@ednaemajka.mk</a>
          </p>
          <Form loading={loading}>
            <Form.Input value={name} onChange={(e) => setName(e.target.value)} label="Име и презиме" required />
            <Form.Input value={phone} onChange={(e) => setPhone(e.target.value)} label="Телефонски број" required />
            <Form.Input value={email} onChange={(e) => setEmail(e.target.value)} label="Е-маил адреса" required />
            <Form.Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              label="Веб-сајт или Facebook или Instagram"
            />
            <Form.TextArea value={message} onChange={(e) => setMessage(e.target.value)} label="Порака" />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          disabled={loading || name.trim().length === 0 || phone.trim().length === 0 || !validateEmail(email)}
          onClick={() => {
            setLoading(true)
            fetch('/api/contactCooperation', {
              method: 'POST',
              body: JSON.stringify({ name, phone, email, website, message })
            })
              .then(() => setOpen(false))
              .catch((e) => console.error(e))
              .finally(() => setLoading(false))
          }}
        >
          Испрати
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
