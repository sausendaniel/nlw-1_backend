import { Request, Response } from "express"
import knex from "../db/conn"

class PointsController {
  async index(req: Request, res: Response) {
    const trx = await knex.transaction()

    const { city, uf, items } = req.query

    const parsedItems = String(items).split(",").map(item => Number(item.trim()))

    const points = await trx("points")
      .join("points_items", "points.id", "=", "points_items.point_id")
      .whereIn("points_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .select("points.*")
      .distinct()

    trx.commit()

    return res.json(points)
  }

  async show(req: Request, res: Response) {
    const trx = await knex.transaction()

    // Show point
    const { id } = req.params
    const point = await trx("points").where("id", id).first()

    if (!point) {
      trx.rollback()
      return res.status(400).json({ message: "Point not found." })
    }

    const items = await trx("items")
      .join("points_items", "items.id", "=", "points_items.item_id")
      .where("points_items.point_id", id)
      .select("items.title")
      .catch(trx.rollback)

    trx.commit()

    return res.json({ point, items })
  }

  async create(req: Request, res: Response) {
    const trx = await knex.transaction()

    // Spreads request body except 'items'
    const { items, ...point } = req.body
    point.image = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=60"

    // Inserts 'point'
    const insertedIds = await trx("points").insert({ ...point })
    const point_id = insertedIds[0]

    // Points-Items relationship
    const pointsItems = items.map((item_id: number) => ({ item_id, point_id }))
    await trx("points_items").insert(pointsItems)

    trx.commit()

    return res.json({ id: point_id, ...point })
  }
}

export default PointsController
