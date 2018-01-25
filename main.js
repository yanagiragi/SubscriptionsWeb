const express = require('express')
const fs = require('fs')

const app = express()
app.listen(3000)

const filepath = './container.json'

app.get('/', (req, res) => {
	data = fs.readFileSync('index.html', 'utf8')
	res.send(data)
})

app.get('/json', (req, res) => {
	data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
	res.send(data)
})
