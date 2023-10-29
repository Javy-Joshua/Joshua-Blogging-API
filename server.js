const app = require('./api')
const db = require('./db')


const port = process.env.PORT || 4000

db.connect()

app.listen(port, () => console.log(`we are connected to port:${port}`))