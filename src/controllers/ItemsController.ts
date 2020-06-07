import { Request, Response } from "express"
import knex from "../db/conn"

class ItemsController {
  async index(req: Request, res: Response) {
    const trx = await knex.transaction()

    // Select all items
    const items = await trx("items").select("*")
  
    // Spread all columns and serialize 'image'
    const serializedItems = items.map(item => ({ ...item, image: `http://localhost:3333/assets/${item.image}` }))
  
    trx.commit()

    return res.json(serializedItems)
  }
}

export default ItemsController
