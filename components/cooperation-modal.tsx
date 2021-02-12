import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Modal, Form, Button, Header, Message } from 'semantic-ui-react'
import { validateEmail } from '../lib/util'

export const CooperationContactModal = (props: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [open, setOpen] = useState(false)

  const { control, errors, handleSubmit, reset } = useForm({
    reValidateMode: 'onBlur'
  })

  const onSubmit = (data: any) => {
    setLoading(true)
    fetch('/api/contactCooperation', {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(() => {
        reset()
        setLoading(false)
        setOpen(false)
      })
      .catch((e) => {
        setLoading(false)
        setFormError(e.message)
        console.error(e)
      })
  }

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
        <Header>Пополнете ја формата за соработка и стапи во контакт со нашиот тим.</Header>
        <Modal.Description>
          <Form error={formError.length > 0} loading={loading} onSubmit={handleSubmit(onSubmit)}>
            <Message error header="Грешка при праќање на порака. Обидете се повторно." content={formError} />
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: 'Ве молиме внесете вашето име.' }}
              render={({ onChange, value }) => (
                <Form.Input
                  error={errors.name?.message}
                  required
                  value={value}
                  onChange={onChange}
                  label="Име и презиме"
                />
              )}
            />
            <Controller
              name="phone"
              type="tel"
              control={control}
              defaultValue=""
              rules={{ required: 'Ве молиме внесете вашиот телефонски број.' }}
              render={({ onChange, value }) => (
                <Form.Input
                  error={errors.phone?.message}
                  required
                  value={value}
                  onChange={onChange}
                  label="Телефонски број"
                />
              )}
            />
            <Controller
              name="email"
              type="email"
              control={control}
              defaultValue=""
              rules={{
                required: 'Ве молиме внесете вашата е-маил адреса.',
                validate: (data: string) =>
                  validateEmail(data) || 'Ве молиме внесете валидна е-маил адреса. Пример ime@gmail.com'
              }}
              render={({ onChange, value }) => (
                <Form.Input
                  error={errors.email?.message}
                  required
                  value={value}
                  onChange={onChange}
                  label="Е-маил адреса"
                />
              )}
            />
            <Controller
              name="website"
              type="url"
              control={control}
              defaultValue=""
              render={({ onChange, value }) => (
                <Form.Input value={value} onChange={onChange} label="Веб-сајт или Facebook или Instagram" />
              )}
            />
            <Controller
              name="message"
              control={control}
              defaultValue=""
              render={({ onChange, value }) => <Form.TextArea value={value} onChange={onChange} label="Порака" />}
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          // disabled={loading || name.trim().length === 0 || phone.trim().length === 0 || !validateEmail(email)}
          onClick={() => handleSubmit(onSubmit)()}
        >
          Испрати
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
