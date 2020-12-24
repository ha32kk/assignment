import express, {Request, Response} from "express"
import {categories, last_update} from "./data"

const app = express()

const server = app.listen(3000)

app.get("/category/:category", (req: Request, res: Response) => {
	if(!categories.has(req.params.category)) {
		res.sendStatus(404)
	} else {
		res.send({updated: last_update, categories: categories.get(req.params.category)})
	}
})

process.on("SIGTERM", () => {
	server.close()
})

process.on("SIGINT", () => {
	server.close()
})