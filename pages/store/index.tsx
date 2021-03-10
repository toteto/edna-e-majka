import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Table, Button, Icon, Modal, Loader, Image } from 'semantic-ui-react'
import CreateStoreForm from '../../components/store/createStoreForm'
import { useAuth } from '../../lib/firebase-auth-context'
import { useFirebaseApp } from '../../lib/firebase-context'
import { stores } from '../../lib'

const StoreManagementHome = () => {
  const { user } = useAuth()
  const firebaseApp = useFirebaseApp()
  const [userStoresIds, setUserStoresIds] = useState<string[] | 'loading'>('loading')
  const [userStores, setUserStores] = useState<stores.Store[] | 'loading'>('loading')

  useEffect(() => {
    if (!user) return setUserStoresIds('loading')

    const unsubscribe = firebaseApp
      .firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setUserStoresIds((doc.data() as { stores: string[] })?.stores ?? [])
      })

    return unsubscribe
  }, [user])

  useEffect(() => {
    if (userStoresIds === 'loading') return setUserStores('loading')
    if (userStoresIds.length === 0) return setUserStores([])

    stores.getMultiple(firebaseApp, userStoresIds).then(setUserStores)
  }, [userStoresIds])

  if (userStores === 'loading') return <Loader active>Се вчитуваат вашите продавници</Loader>

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Статус</Table.HeaderCell>
          <Table.HeaderCell>Име на продавница</Table.HeaderCell>
          <Table.HeaderCell>Опис</Table.HeaderCell>
          <Table.HeaderCell>Контакти</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {userStores.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan="5">
              Нема продавници кон кои имате пристап. Користете копчето за креирање на нова продавница.
            </Table.Cell>
          </Table.Row>
        ) : (
          userStores.map((store) => (
            <Table.Row key={store.id}>
              <Table.Cell collapsing>
                {store.status === 'enabled' && 'Активна'}
                {store.status === 'disabled' && 'Неактивна'}
              </Table.Cell>
              <Table.Cell
                content={
                  <div>
                    <Image avatar size="tiny" src={store.avatar} />
                    {store.name}
                  </div>
                }
              />
              <Table.Cell content={<p style={{ whiteSpace: 'pre-wrap' }}>{store.description}</p>} />
              <Table.Cell>
                <p>
                  <Icon name="phone" />
                  {store.contact.phone ?? 'Нема телефон'}
                </p>
                <p>
                  <Icon name="mail" />
                  {store.contact.email ?? 'Нема е-маил'}
                </p>
                <p>
                  <Icon name="facebook" />
                  {store.contact.facebook ?? 'Нема Facebook'}
                </p>
                <p>
                  <Icon name="instagram" />
                  {store.contact.instagram ?? 'Нема Instagram'}
                </p>
              </Table.Cell>
              <Table.Cell>
                <Link href={`/store/${store.id}/products`}>
                  <Button icon="shop" labelPosition="left" content="Производи" />
                </Link>
                <Modal
                  closeIcon
                  trigger={<Button icon="edit" labelPosition="left" content="Измени" />}
                  header="Измени продавница"
                  content={
                    <Modal.Content>
                      <CreateStoreForm store={store} onSuccess={() => {}} />
                    </Modal.Content>
                  }
                />
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan="6">
            <Modal
              closeIcon
              trigger={
                <Button icon fluid labelPosition="left" primary>
                  <Icon name="shop" />
                  Креирај нова продавница
                </Button>
              }
            >
              <Modal.Header>Креирај продавница</Modal.Header>
              <Modal.Content>
                <CreateStoreForm onSuccess={() => {}} />
              </Modal.Content>
            </Modal>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}

export default StoreManagementHome
