import config from "@codewithwest/module-knight-trainer/providers/constants.js"
import ClientQueries from "../queries/client_queries.js"
import express from 'express'


var client_routes = express.Router()
const connection = new ClientQueries(config.db_url, config.db_name, "clients")
client_routes.post('/new-client', async (req, res) => {
    try {
        var body = req.body
        if (body.username && body.email && body.organisation) {
            var client = await connection.register_client(body)

            res.json(client)
        }

        res.status(400).json({
            error: "Error request missing required data 😂",
            message: "invalid Access request👀, please contact server owner to request accesss😉",
            contact: "✉westdynamics.tech@gmail.coms"
        })
    } catch (error) {
        throw { message: "Error request missing required data 😂" }
    }
})

client_routes.post('/get-client-token', async (req, res) => {

    try {
        var client = await connection.get_client_data(req.body)

        res.json(client)
    } catch (error) {
        throw { message: "Error request missing required data 😂" }
    }
})

client_routes.post('/new-client-token', async (req, res) => {

    try {
        var client = await connection.update_client(req?.body, req?.body?.email)

        res.json(client)
    } catch (error) {
        throw { message: "Error request missing required data 😂" }
    }
})

export { client_routes }

