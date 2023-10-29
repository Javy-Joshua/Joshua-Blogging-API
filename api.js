const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const userRouter = require('./user/users.router')
const blogRouter = require('./blog/blog.route')



const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))


app.use('/', userRouter )

app.use('/', blogRouter )





//to handle incorrect route
app.get('*', (req, res) => {
    return res.status(404).json({
        data: null,
        error: "Route not found"
    })
})

//global error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        data: null,
        error: "Route not found"
    })
})


module.exports = app 
