import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  Button,
  Dropdown,
  Form,
  Header,
  Icon,
  Image,
  Input,
  Label,
  Loader,
  Message,
  Modal,
  Statistic
} from 'semantic-ui-react'
import { useFirebaseApp } from '../../../lib/firebase-context'
import firebase from 'firebase'
import 'firebase/firestore'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Category } from '../../../lib/categories2'
import { categories, products } from '../../../lib'
import { v4 as uuid } from 'uuid'

const ManageStoreProducts = () => {
  const firebaseApp = useFirebaseApp()
  const { storeId } = useRouter().query
  if (typeof storeId !== 'string') throw new Error(`Invalid storeId type ${typeof storeId}.`)

  const [storeProducts, setStoreProducts] = useState<products.Product[] | 'loading'>('loading')
  useEffect(() => products.liveProductsForStore(firebaseApp, storeId, setStoreProducts), [])

  if (storeProducts === 'loading') return <Loader active>Се вчитуваат производите</Loader>

  const items = storeProducts.map((product) => (
    <div
      key={product.id}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
        borderBottom: '1px solid grey',
        padding: 10
      }}
    >
      <Image size="medium" spaced src={product.images[0]} />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Header as="h2" content={product.title} subheader={product.description.slice(0, 200) + '...'} />
        {product.variants.map((v) => (
          <Statistic key={v.title} size="mini" color="red" label={v.title} value={v.price + ' МКД'} />
        ))}
        <Button.Group style={{ alignSelf: 'end' }}>
          <Button
            icon="delete"
            labelPosition="right"
            content="Избриши"
            negative
            onClick={() => {
              const confirmed = confirm(`Дали сте сигурни дека сакате да избришите продуктот "${product.title}"?`)
              if (confirmed) {
                firebaseApp
                  .storage()
                  .ref(`storesAssets/${product.store}/${product.id}`)
                  .listAll()
                  .then(({ items }) => items.forEach(async (f) => f.delete()))
                firebaseApp.firestore().collection('products').doc(product.id).delete()
              }
            }}
          />
          <Modal
            closeIcon
            closeOnDimmerClick={false}
            closeOnEscape={false}
            trigger={
              <Button icon labelPosition="right" primary onClick={() => {}}>
                <Icon name="edit" />
                Измени
              </Button>
            }
          >
            <Modal.Header>Измени производ</Modal.Header>
            <Modal.Content>
              <ProductForm storeId={storeId} product={product} />
            </Modal.Content>
          </Modal>
        </Button.Group>
      </div>
    </div>
  ))

  return (
    <div>
      <Modal
        closeIcon
        closeOnDimmerClick={false}
        closeOnEscape={false}
        trigger={<Button icon="shop" labelPosition="left" content="Креирај нов производ" color="green" fluid />}
      >
        <Modal.Header>Креирај производ</Modal.Header>
        <Modal.Content>
          <ProductForm storeId={storeId} />
        </Modal.Content>
      </Modal>
      {items}
    </div>
  )
}

const ProductForm = (props: { storeId: string; product?: products.Product }) => {
  const [allCategories, setAllCategories] = useState<Category[] | 'loading'>('loading')
  const [submitStatus, setSubmitStatus] = useState<'loading' | 'success' | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const firebaseApp = useFirebaseApp()

  useEffect(() => {
    categories.getAll(firebaseApp).then(setAllCategories)
  }, [])

  const { register, control, errors, handleSubmit, reset } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      title: props.product?.title ?? '',
      description: props.product?.description ?? '',
      images: new DataTransfer().files,
      variants: props.product?.variants ?? [{ title: '', price: undefined }],
      categories: props.product?.categories?.map((c) => c.id) ?? []
    }
  })
  const { fields, append, remove } = useFieldArray<products.ProductVariant>({
    control,
    name: 'variants'
  })

  if (allCategories === 'loading') return <Loader active content="Се вчитува..." />

  const onSubmit = async (data: {
    title: string
    description: string
    images: File[]
    variants: { title: string; price: string }[]
    categories: string[]
  }) => {
    setSubmitStatus('loading')
    const firestore = firebaseApp.firestore()
    const storage = firebaseApp.storage()

    const productRef = firestore.collection('products').doc(props.product?.id)

    try {
      const images: string[] = data.images.length > 0 ? [] : props.product?.images ?? []
      for (const image of data.images) {
        const uploadTask = await storage.ref(`storesAssets/${props.storeId}/${productRef.id}/${uuid()}`).put(image)
        const downloadUrl = await uploadTask.ref.getDownloadURL()
        images.push(downloadUrl)
      }

      if (props.product) {
        await productRef.update({
          title: data.title,
          description: data.description,
          variants: [...data.variants],
          categories: data.categories.map((id) => allCategories.find((c) => c.id === id)),
          images
        })
      } else {
        await productRef.set({
          created: firebase.firestore.FieldValue.serverTimestamp(),
          store: props.storeId,
          title: data.title,
          description: data.description,
          variants: [...data.variants],
          categories: data.categories.map((id) => allCategories.find((c) => c.id === id)),
          images
        })
      }

      reset()
      setSubmitStatus('success')
    } catch (e) {
      setSubmitStatus(null)
      setError(e)
    }
  }

  const variantForms = fields.map((item, index) => (
    <Form.Group key={item.id}>
      <Controller
        name={`variants[${index}].title`}
        control={control}
        defaultValue={item.title ?? ''}
        rules={{ required: 'Ве молиме внесете наслов за варијантата од производот.' }}
        render={({ onChange, value }) => (
          <Form.Input
            error={errors.variants?.[index]?.title?.message}
            value={value}
            onChange={onChange}
            label="Наслов"
            placeholder="Наслов за варијантата"
            width={10}
          />
        )}
      />
      <Controller
        name={`variants[${index}].price`}
        control={control}
        defaultValue={item.price ?? ''}
        rules={{
          validate: (value) => (Number.isNaN(Number.parseFloat(value)) ? 'Внесете валидна цена' : true)
        }}
        render={({ onChange, value }) => (
          <Form.Field width={6} error={!!errors.variants?.[index]?.price}>
            <label>Цена</label>
            <Input
              value={value}
              onChange={onChange}
              placeholder="Цена за варијантата"
              labelPosition="right"
              label={{ basic: true, content: 'МКД' }}
            />
          </Form.Field>
        )}
      />
      <Button disabled={fields.length === 1} icon="delete" color="red" onClick={() => remove(index)} />
    </Form.Group>
  ))

  return (
    <Form
      loading={submitStatus === 'loading'}
      success={submitStatus === 'success'}
      error={!!error}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Message
        error
        header={`Грешка при ${props.product ? 'измена' : 'креирање'} на производ. Обидете се повторно`}
        content={error?.message}
      />
      <Message success header={`Успешно ${props.product ? 'изменување' : 'креирање'} на производот.`} />
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Ве молиме внесете наслов за производот.' }}
        render={({ onChange, value }) => (
          <Form.Input
            error={errors.title?.message}
            value={value}
            onChange={onChange}
            label="Наслов"
            placeholder="Наслов на производот"
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        rules={{ required: 'Ве молиме внесете краток за производот.' }}
        render={({ onChange, value }) => (
          <Form.TextArea
            error={errors.description?.message}
            value={value}
            onChange={onChange}
            label="Краток опис"
            placeholder="Опис за производот"
            rows={13}
            style={{ whiteSpace: 'pre-wrap' }}
          />
        )}
      />
      <Form.Field error={errors.images?.message != null}>
        <label>Слики од производот</label>
        <input
          type="file"
          multiple
          name="images"
          accept=".png, .jpg, .jpeg"
          ref={register({ required: !props.product })}
        />
      </Form.Field>
      <Controller
        name="categories"
        control={control}
        rules={{ validate: (v: string[]) => v.length > 0 || 'Ве молиме слекетирајте категорија за продуктот' }}
        render={({ onChange, value }) => (
          <Form.Field error={!!errors.categories}>
            <Dropdown
              placeholder="Категории"
              fluid
              multiple
              selection
              options={allCategories.map((c) => ({ key: c.id, text: c.title, value: c.id }))}
              onChange={(_, data) => onChange(data.value)}
              value={value}
            />
            {errors.categories && (
              <Label pointing prompt>
                {(errors.categories as any).message}
              </Label>
            )}
          </Form.Field>
        )}
      />

      <Header content="Варијанти" />
      {variantForms}
      <Button
        onClick={(e) => {
          e.preventDefault()
          append({ title: '', price: undefined })
        }}
        content="Креирај нова варијанта"
        color="green"
        icon="add"
        labelPosition="left"
        size="mini"
      />
      <Button fluid primary style={{ marginTop: 10 }} content="Потврди" />
    </Form>
  )
}

export default ManageStoreProducts
