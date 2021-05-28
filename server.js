const express = require("express")
const mongoose = require("mongoose")
const expressHandlebars = require("express-handlebars")
const config = require("config")
const morgan = require('morgan')
const path = require('path')
const formRoute = require('./routes/formRoute')
const { PurgeCSS } = require('purgecss')


const PORT = config.get('port') || 3000

const app = express()
const hbs = expressHandlebars.create({
    layoutsDir: "views/layouts",
    defaultLayout: 'main',
    extname: 'hbs'
})


app.engine('hbs', hbs.engine)

app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(morgan('dev'))
app.use(formRoute)

app.use(express.static(path.join(__dirname, 'public')))

async function start () {
    try {
        await mongoose.connect(config.get('dbUrl'), {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true
        })

        app.listen(PORT, () => {
            console.log('Server has been started...')
        });

    } catch (e) {
        console.log(e)
    }
}

const purgeCSSResult = new PurgeCSS().purge({
    content: ['./views/partials/consent', './views/partials/form'],
    css: ['./public/style/style.css']
})
purgeCSSResult

start()