import express from "express"

import ItemsController from "./controllers/ItemsController"
import PointsController from "./controllers/PointsController"

const routes = express.Router()
const itemsController = new ItemsController()
const pointsController = new PointsController()

routes.get("/items", itemsController.index)

routes.get("/point", pointsController.index)
routes.get("/point/:id", pointsController.show)
routes.post("/point", pointsController.create)

export default routes
