const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const tasks = require('./routes/tasks')
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// Config
require('dotenv').config()
app.use(express.static('./public'))
app.use(express.json())

// Routes
app.use('/api/v1/tasks', tasks)

// Middlewares
app.use(notFound)
app.use(errorHandlerMiddleware)

// Variables
const port = process.env.APP_PORT || 3000
const connectionString = process.env.MONGO_URI

const start = async () => {
    try {
        await connectDB(connectionString)
            .then(() => console.log('Connected to the database'))

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()