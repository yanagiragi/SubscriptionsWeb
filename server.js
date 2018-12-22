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

app.use(function(req, res, next){
	
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	if(ip && req.path){
		console.log(`Request from ${ip}, path = ${req.path}`)
	}
	else{
		console.log(`Request from ????, path = ${req.path}`)
	}
	next()
})

app.get('/', (req, res) => {
	data = fs.readFileSync('index.html', 'utf8')
	res.send(data)
	data = null
})

app.get('/json', (req, res) => {
	// RagiDB.GetContainer().then(data => res.send(data))
	
	try{
		let data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
		data.container.map( e => {
			e.list = e.list.filter(e2 => !e2.isNoticed)
		})
		res.send(data)
	} catch(e){
		res.send(`Error`)
	}
	data = null
})

app.get('/jsonAll', (req, res) => {

	try{
	let data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
	res.send(data)
	}
	catch(e)
	{
		res.send(`Error`)
	}
	data = null
})

app.get('/readAll/:title', (req, res) => {	
	
	let entryIds = req.params.title.split('&')
	containerId = entryIds[0]
	entryIds.splice(0, 1)
	// dont try to use let [containerId, entryIds] = ... here
	// you may need to modified RagiDB API 
	
	console.log(`readAll ${containerId} : ${entryIds}`)
	
	RagiDB.NoticeEntryAll(containerId, entryIds).then(()=> res.send('DONE'))

	entryIds = null
	containerId = null
})

app.get('/read/:title', (req, res) => {
	
	let [containerId, entryId] = req.params.title.split('|')
	
	RagiDB.NoticeEntry(containerId, entryId).then(()=> res.send('DONE'))
	
	entryId = null
	containerId = null

})
