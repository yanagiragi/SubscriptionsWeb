const express = require('express')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')
const RagiDB = require('../RagiDB/api.js')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))
app.listen(3001)

console.log('RagiSubscriptionWeb Start')

const filepath = '../RagiDB/data/container.json'
const datapath = '../RagiSubscription/data/data.json'

app.use(function (req, res, next) {
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
	if (ip && req.path) {
		console.log(`Request from ${ip}, path = ${req.path}`)
	} else {
		console.log(`Request from ????, path = ${req.path}`)
	}
	next()
})

app.get('/', (req, res) => {
	let data = fs.readFileSync('index.html', 'utf8')
	res.send(data)
})

app.get('/json', (req, res) => {
	// RagiDB.GetContainer().then(data => res.send(data))
	try {
		let data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
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
		let data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
		res.send(data)
	} catch (e) {
		res.send('Error')
	}
})

app.get('/readAll/:title', (req, res) => {
	let entryIds = req.params.title.split('&')
	let containerId = entryIds[0]
	entryIds.splice(0, 1)
	// dont try to use let [containerId, entryIds] = ... here
	// you may need to modified RagiDB API

	console.log(`readAll ${containerId} : ${entryIds}`)

	RagiDB.NoticeEntryAll(containerId, entryIds).then(() => res.send('DONE')).catch(e => {
		console.log(e)
		process.exit()
	})
})

app.get('/read/:title', (req, res) => {
	let [containerId, entryId] = req.params.title.split('|')
	RagiDB.NoticeEntry(containerId, entryId).then(() => res.send('DONE')).catch(e => {
		console.log(e)
		process.exit()
	})
})

app.get('/manage', (req, res) => {
	let data = fs.readFileSync('data.html', 'utf8')
	res.send(data)
})

app.get('/data', (req, res) => {
	try {
		let data = JSON.parse(fs.readFileSync(datapath, 'utf8'))
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
			fs.writeFileSync(datapath, JSON.stringify(data, null, 4), 'utf8')
			console.log('updated data.json')
			res.send('OK')
		}
	} catch (e) {
		console.log(e)
		res.send('Error')
	}
})
