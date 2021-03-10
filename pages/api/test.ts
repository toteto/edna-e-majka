import { NextApiHandler } from 'next'
import firebase from 'firebase'
import { categories, products } from '../../lib'

const handler: NextApiHandler = async (req, res) => {
  const data = await products.getByCategory(firebase.app(), 'honey')
  res.json(data)
}

export default handler
