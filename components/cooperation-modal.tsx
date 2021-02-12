import { useState } from 'react'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useForm, Controller } from 'react-hook-form'
import { Modal, Form, Button, Header, Message } from 'semantic-ui-react'
import { validateEmail } from '../lib/util'

export const CooperationContactModal = (props: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false)

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
          <GoogleReCaptchaProvider reCaptchaKey="6LcTvVUaAAAAAN04dlq1LDH7-wZ5vzplvi-Q1wse">
            <CooperationForm onSuccess={() => setOpen(false)} />
          </GoogleReCaptchaProvider>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

const CooperationForm = (props: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const { executeRecaptcha } = useGoogleReCaptcha()

  const { control, errors, handleSubmit, reset } = useForm({
    reValidateMode: 'onChange'
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    setFormError('')
    executeRecaptcha()
      .then((token) =>
        fetch('/api/contactCooperation', {
          method: 'POST',
          body: JSON.stringify({ token, ...data })
        })
      )
      .then(async (r) => {
        if (r.ok) {
          reset()
          setLoading(false)
          props.onSuccess()
        } else {
          throw Error(await r.text())
        }
      })
      .catch((e) => {
        setLoading(false)
        setFormError(e.message)
      })
  }

  return (
    <Form error={formError.length > 0} loading={loading} onSubmit={handleSubmit(onSubmit)}>
      <Message error header="Грешка при праќање на порака. Обидете се повторно." content={formError} />
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{ required: 'Ве молиме внесете вашето име.' }}
        render={({ onChange, value }) => (
          <Form.Input error={errors.name?.message} value={value} onChange={onChange} label="Име и презиме" />
        )}
      />
      <Controller
        name="phone"
        type="tel"
        control={control}
        defaultValue=""
        rules={{ required: 'Ве молиме внесете вашиот телефонски број.' }}
        render={({ onChange, value }) => (
          <Form.Input error={errors.phone?.message} value={value} onChange={onChange} label="Телефонски број" />
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
          <Form.Input error={errors.email?.message} value={value} onChange={onChange} label="Е-маил адреса" />
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
      <Button positive fluid disabled={Object.keys(errors).length > 0 || loading}>
        Испрати
      </Button>
    </Form>
  )
}
