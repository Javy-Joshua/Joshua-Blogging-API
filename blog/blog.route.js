const express = require('express')
const middleware = require('./blog.middleware')
const controller = require('./blog.controller')
const globalmiddleware = require('../middleware/global.midddleware')
const cacheMiddleWare = require("../middleware/cache.middleware")

const router = express.Router()

router.get('/blog', cacheMiddleWare.cacheMiddleWare, controller.GetPublished)

router.use(globalmiddleware.bearerTokenAuth)

router.get('/blog/:id', controller.AuthorBlog)

router.post('/blog', middleware.ValidateBlogCreation, controller.CreateBlog)

router.patch('/update/:id', controller.UpdateBlog)

router.delete('/delete/:id', controller.DeleteBlog)

module.exports = router



