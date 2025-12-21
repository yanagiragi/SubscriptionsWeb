const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const ip = process.env.DB_IP || 'http://127.0.0.1'
const { SubscriptionsDbApi } = require('subscriptionsdb')
const DbApi = new SubscriptionsDbApi(ip)

const TOKEN = Date.now().toString()
const PASSWORD = process.env.RSW_PASSWORD || 'PASSWORD'
const PORT = 3007
const COOKIE_NAME = Math.random()

const dataPath = '../Crawler/data/data.json'

const indexPath = path.join(__dirname, 'html', 'index.html')
const managePath = path.join(__dirname, 'html', 'manage.html')
const loginPath = path.join(__dirname, 'html', 'login.html')

const app = express()

// must setup plugins before setup any route!
app.use(cors())
app.use(cookieParser(TOKEN))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.listen(PORT)

console.log(`RagiSubscriptionWeb Start on ${ip}:${PORT}, TOKEN = ${TOKEN}`)

app.use(async function (req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    console.log(`Request from ${ip || '???'}, path = ${req.path}, req.cookies = ${JSON.stringify(req.cookies)}`)

    const whiteList = ['/login', '/favicon.ico']
    if (whiteList.includes(req.path) || (req.cookies && req.cookies[COOKIE_NAME] === TOKEN)) {
        next()
    } else {
        res.redirect('/login')
    }
})

app.get('/', (req, res) => {
    res.sendFile(indexPath)
})

app.get('/login', (req, res) => {
    if (req.signedCookies && req.signedCookies.auth === TOKEN) {
        res.redirect('/')
    } else {
        res.sendFile(loginPath)
    }
})

app.post('/login', (req, res) => {
    if (req.body.password === PASSWORD) {
        res.cookie(COOKIE_NAME, TOKEN, { maxAge: 1000 * 60 * 60 * 24 * 365 })
        res.redirect('/')
    } else {
        res.redirect('/login')
    }
})

app.get('/json', async (req, res) => {
    try {
        const data = await DbApi.GetUnNoticedContainers()
        res.send(data)
    } catch (e) {
        console.log(e)
        res.send('Error')
    }
})

app.get('/json/:type/:nickname', async (req, res) => {
    try {
        const type = req.params.type
        const nickname = req.params.nickname
        const data = await DbApi.GetContainersWithFilter(type, nickname)
        res.send(data)
    } catch (e) {
        console.log(e)
        res.send('Error')
    }
})

app.get('/jsonAll', async (req, res) => {
    try {
        const data = await DbApi.GetContainers()
        res.send(data)
    } catch (e) {
        console.log(e)
        res.send('Error')
    }
})

app.get('/readAll/:title', async (req, res) => {
    const listIds = req.params.title.split('&')
    console.log(`readAll : ${listIds}`)
    const args = { listIds }
    const result = await DbApi.NoticeEntryAll(args)
    res.send('DONE')
})

app.get('/read/:title', async (req, res) => {
    const args = { id: req.params.title }
    console.log(`read : ${args}`)
    const result = await DbApi.NoticeEntry(args)
    res.send('DONE')
})

app.get('/manage', (req, res) => {
    const data = fs.readFileSync(managePath, 'utf-8')
    res.send(data)
})

app.get('/data', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
        res.send(data)
    } catch (e) {
        console.log(e)
        res.send('Error')
    }
})

app.post('/save', (req, res) => {
    try {
        const data = req.body
        const errorFunc = ele => (ele.url === 'NULL' || ele.nickname === 'NULL' || ele.url.length === 0 || ele.nickname.length === 0)
        const filteredData = data.filter(ele => ele.type !== 'Pages.Functions')
        const Invalids = []
        for (let i = 0; i < filteredData.length; ++i) {
            const invalideSites = filteredData[i].sites.reduce((acc, ele) => errorFunc(ele) ? acc.concat(ele) : acc, [])
            if (invalideSites.length > 0) { Invalids.push(invalideSites) }
        }

        console.log(`isInvalid = ${JSON.stringify(Invalids)}`)

        if (Invalids.length > 0) {
            res.send('NO')
        } else {
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 4), 'utf8')
            console.log('updated data.json')
            res.send('OK')
        }
    } catch (e) {
        console.log(e)
        res.send('Error')
    }
})
