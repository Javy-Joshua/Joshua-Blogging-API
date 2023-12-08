const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const userRouter = require('./user/users.router')
const blogRouter = require('./blog/blog.route')
const rateLimit = require('express-rate-limit')
const multer = require("multer")
const upload = multer({ dest: 'uploads/' })
const cloudinary = require('./integration/cloudinary')
const fs = require('fs')



const app = express()

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1 mintues
  limit: 3, // Limit each IP to 3 requests per `window` (here, per 1 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter)

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.post('/file/upload', upload.single('file'), async (req, res, next) => {
    //upload file to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path)

    // delete file from file directory
    fs.unlink(req.file.path, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })

    // return response
    return res.json({
        data: cloudinaryResponse,
        error: null
    })
    
})

app.use('/', userRouter )

app.use('/', blogRouter )

//limiter for home route(middleware)
const homeRouteLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 mintue
    limit: 100,
    standardheaders: 'draft-7'
})


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



// app.post("/file/upload", upload.single("file"), async (req, res, next) => {
//   return res.json({
//     data: req.file,
//     error: null,
//   });
// });