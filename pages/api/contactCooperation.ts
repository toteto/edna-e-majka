import { NextApiHandler } from 'next'
import nodemailer from 'nodemailer'

export type ContactCooperation = {
  name: string
  email: string
  phone: string
  website: string
  message: string
}

const handler: NextApiHandler = async (req, res) => {
  const transport = nodemailer.createTransport({
    host: 'smtppro.zoho.eu',
    port: 465,
    auth: {
      user: 'antonioivanovski@gmail.com',
      pass: 'asfBLAm1GqLw'
    }
  })

  await transport
    .sendMail({
      from: 'sorabotka@ednaemajka.mk',
      to: 'sorabotka@ednaemajka.mk',
      subject: 'Една е мајка: барање за соработка',
      text: req.body
    })
    .then(() => {
      res.status(200).send('Cooperation mail successfully send.')
    })
    .catch((e) => {
      res.status(500).end(`Failed to send cooperation mail. ${e.message}`)
    })
}

export default handler
