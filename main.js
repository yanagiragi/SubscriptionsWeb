const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()
app.use(cors())
app.listen(3000)

const filepath = '../RagiSubscription/data/container.json'

function read(data, str)
{
	console.log("read " + str );
	for(var site in data){
		for(thread in data[site].containerList){
			if(data[site].containerList[thread].title == str){
				if(data[site].containerList[thread].isNoticed){
					return true;
				}
				data[site].containerList[thread].isNoticed = true;
				console.log('Saving container to file...')
				fs.writeFileSync(filepath, JSON.stringify(data, null, 4), 'utf8');
				console.log('Saving Done.')
				return true;
			}
		}
	}
	return false
}

app.get('/', (req, res) => {
	data = fs.readFileSync('index.html', 'utf8')
	res.send(data)
})

app.get('/json', (req, res) => {
	data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
	res.send(data)
})

app.get('/read/:title', (req, res) => {
	title = req.params.title
	for(var key in req.query){
		title += '?' + key
	}
	data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
	result = read(data, title)
	res.send(result)
})
