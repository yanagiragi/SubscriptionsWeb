const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const ip = 'http://127.0.0.1:3000'
const { SubscriptionsDbApi } = require('subscriptionsdb')
const DbApi = new SubscriptionsDbApi(ip)

const TOKEN = Date.now().toString()
const PASSWORD = process.env.RSW_PASSWORD || 'PASSWORD'

const filePath = '../SubscriptionsDB/data/container.json'
const dataPath = '../Subscriptions/data/data.json'

const indexPath = path.join(__dirname, 'html', 'index.html')
const managePath = path.join(__dirname, 'html', 'manage.html')
const loginPath = path.join(__dirname, 'html', 'login.html')

const app = express()

app.use(cors())
app.use(cookieParser(TOKEN))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.listen(3003)

console.log('RagiSubscriptionWeb Start')

app.use(function (req, res, next) {
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
	if (ip && req.path) {
		console.log(`Request from ${ip}, path = ${req.path}`)
	} else {
		console.log(`Request from ????, path = ${req.path}`)
	}

	const whiteList = ['/login', '/favicon.ico']
	if(whiteList.includes(req.path) || (req.signedCookies && req.signedCookies.auth === TOKEN)) {
		next()
	}
	else {
		res.redirect('/login')
	}
})

app.get('/', (req, res) => {
	res.sendFile(indexPath)
})

app.get('/login', (req, res) => {
	if(req.signedCookies && req.signedCookies.auth === TOKEN) {
		res.redirect('/')
	}
	else {
		res.sendFile(loginPath)
	}
})

app.post('/login', (req, res) => {
	if(req.body.password === PASSWORD){
		res.cookie('auth', TOKEN, { signed: true, maxAge: 1000 * 60 * 60 * 24 * 365 })
		res.redirect('/')
	}
	else {
		res.redirect('/login')
	}
})

app.get('/json', (req, res) => {
	try {
		const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
		data.container.map(e => {
			e.list = e.list.filter(e2 => !e2.isNoticed)
		})
		res.send(data)
	} catch (e) {
		res.send('Error')
	}
})

app.get('/jsonAll', (req, res) => {
	try {
		const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
		res.send(data)
	} catch (e) {
		res.send('Error')
	}
})

app.get('/readAll/:title', async (req, res) => {
	let listIds = req.params.title.split('&')
	let containerId = listIds[0]
	listIds.splice(0, 1)
	console.log(`readAll ${containerId} : ${listIds}`)
	const args = { containerId, listIds }
	const result = await DbApi.NoticeEntryAll(args)
	res.send('DONE')
})

app.get('/read/:title', async (req, res) => {
	let [containerId, listId] = req.params.title.split('|')
	const args = { containerId, listId }
	const result = await DbApi.NoticeEntry(args)
	res.send('DONE')
})

app.get('/manage', (req, res) => {
	let data = fs.readFileSync(managePath, 'utf-8')
	res.send(data)
})

app.get('/data', (req, res) => {
	try {
		let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
		res.send(data)
	} catch (e) {
		res.send('Error')
	}
})

app.post('/save', (req, res) => {
	try {
		let data = req.body

		let isInvalid = 0

		for (let i = 0; i < data.length; ++i) {
			isInvalid += data[i].sites.reduce((acc, ele) => {
				if (ele.url === 'NULL' || ele.nickname === 'NULL') { return acc.concat(ele) } else { return acc }
			}, []).length > 0
		}

		console.log(`isInvalid = ${isInvalid}`)

		if (isInvalid) {
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
