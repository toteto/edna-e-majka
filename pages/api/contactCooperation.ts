import { NextApiHandler } from 'next'
import nodemailer from 'nodemailer'

export type ContactCooperation = {
  name: string
  email: string
  phone: string
  website: string
  message: string
}

const reCaptchaSecret = '6LcTvVUaAAAAANSHVdXxXvuY3T4BpQ0N_haSRgyQ'

const handler: NextApiHandler = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  const verify: { success: boolean; score: number; 'error-codes': string[] } = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: [['Content-Type', 'application/x-www-form-urlencoded']],
      body: `secret=${reCaptchaSecret}&response=${JSON.parse(req.body).token}&remoteip=ip`
    }
  )
    .then((res) => res.json())
    .catch(() => ({ success: false, score: 0, 'error-codes': ['my-failed-request'] }))
  console.log(ip, verify)

  if (verify.success || verify.score < 0.3) {
    res.status(403).end(`Failed reCaptcha verify. codes: ${verify['error-codes']}`)
    return
  }

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
