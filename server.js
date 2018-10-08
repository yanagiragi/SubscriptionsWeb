const express = require('express')
const cors = require('cors')
const fs = require('fs')
const RagiDB = require('../RagiDB/api.js')

const app = express()
app.use(cors())
app.use(express.static('public'));
app.listen(3001)
console.log("RagiSubscriptionWeb Start")

const filepath = '../RagiDB/data/container.json'

app.get('/', (req, res) => {
	data = fs.readFileSync('index.html', 'utf8')
	res.send(data)
})

app.get('/json', (req, res) => {
	
	// RagiDB.GetContainer().then(data => res.send(data))
	
	let data = JSON.parse(fs.readFileSync(filepath, 'utf8'))

	data.container.map( e => {
		e.list = e.list.filter(e2 => !e2.isNoticed)
	})

	res.send(data)
})

app.get('/jsonAll', (req, res) => {
	res.send(JSON.parse(fs.readFileSync(filepath, 'utf8')))
})

app.get('/readAll/:title', (req, res) => {	
	
	entryIds = req.params.title.split('&')
	containerId = entryIds[0]
	entryIds.splice(0,1)
	
	console.log(`readAll ${containerId} : ${entryIds}`)
	
	RagiDB.NoticeEntryAll(containerId, entryIds).then(()=> res.send())

})

app.get('/read/:title', (req, res) => {
	
	[containerId, entryId] = req.params.title.split('|')
	
	RagiDB.NoticeEntry(containerId, entryId).then(()=> res.send())

})
