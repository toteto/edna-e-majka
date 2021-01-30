import React from 'react'
import { Image, Modal, Header, Label } from 'semantic-ui-react'

export const ContactModal = (props: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Modal
      size="small"
      trigger={props.children}
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>Контактирајте нѐ</Modal.Header>
      <Modal.Content image>
        <Image src="/logo.png" wrapped />
        <Modal.Description>
          <Header icon="heart" content="Многу сакаме кога ни пишувате" />
          <p>
            Слободно можете да ни пишите на било која од социалните мрежи или на нашата мејл адреса. Ветуваме, ќе
            вратиме во најкус можен рок.
          </p>
          <div className={'ui labels'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Label
              as="a"
              color="blue"
              icon="facebook"
              content="Facebook"
              detail="facebook.com/ednaemajka.mk"
              href="https://www.facebook.com/ednaemajka.mk"
            />
            <Label
              as="a"
              color="blue"
              icon="facebook messenger"
              content="Facebook Messenger"
              detail="m.me/ednaemajka.mk"
              href="https://m.me/ednaemajka.mk"
            />
            <Label
              as="a"
              color="purple"
              icon="instagram"
              content="Instagram"
              detail="@ednaemajka.mk"
              href="https://www.instagram.com/ednaemajka.mk/ "
            />
            <Label color="red" icon="mail" content="Мејл" detail="info@ednaemajka.mk" />
          </div>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}
