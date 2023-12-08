const Cache = require("../helpers/cache.helper.js")

// const cacheMiddleWare = (req, res, next) => {
//     const { id } = req.params
//     const cacheKey = `blogs-${id}` // "Henny"
//     const cachedBlog = Cache.get(cacheKey)
//     if (cachedBlog) {
//         console.log("cache hit")
//         console.log({ success: true, message: "success", data: cachedBlog })
//         return
//     }
//     next()
// }



const cacheMiddleWare = (req, res, next) => {
    const { id } = req.params
    const cacheKey = `blogs-${id}` // Use consistent casing
    const cachedBlog = Cache.get(cacheKey)
    if (cachedBlog) {
        console.log("cache hit")
        console.log({ success: true, message: "success", data: cachedBlog })
        return res.json({ success: true, message: "success", data: cachedBlog }); // Send response if cache hit
    }
    next();
}

module.exports = {
    cacheMiddleWare
}