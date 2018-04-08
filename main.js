const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()
app.use(cors())
app.use(express.static('public'));
app.listen(3000)

const filepath = '../RagiSubscription/data/container.json'

function read(data, str)
{
	console.log("read <" + str + ">");
	
	// dirtybit
	var flag = false
	
	for(var site in data){
		for(thread in data[site].containerList){
			if(data[site].containerList[thread].title == str){
				if(!(data[site].containerList[thread].isNoticed)){
					// force search all every time
					// because there are always duplicated title all the time
					data[site].containerList[thread].isNoticed = true;
					flag = true;
				}
			}
		}
	}

	if(flag){
		console.log('Saving container to file...')
		fs.writeFileSync(filepath, JSON.stringify(data, null, 4), 'utf8');
		console.log('Saving Done.')
	}
	return flag
}

function noticed(data)
{
	data.isNoticed = true
	return data
}

function readNoSave(data, str)
{
	console.log("read <" + str + ">");
	
	for(var site in data){
		for(thread in data[site].containerList){
			if(data[site].containerList[thread].title == str){
				if(!(data[site].containerList[thread].isNoticed)){
					// force search all every time
					// because there are always duplicated title all the time
					data[site].containerList[thread].isNoticed = true;
				}
			}
		}
	}
	
	return data
}
function readAll(data, str)
{
	console.log("readAll <" + str + ">")
	
	list = data[str].containerList.reduce((acc, cur) => {
		if(!cur.isNoticed)
			return acc.concat(cur)
		return acc
	}, [])

	// dirtybit
	var flag = list.length > 0

	if(flag){
		
		data[str].containerList.map(x => noticed(x))

		console.log('Saving container to file...')
		fs.writeFileSync(filepath, JSON.stringify(data, null, 4), 'utf8');
		console.log('Saving Done.')
	}
	return flag
}

app.get('/', (req, res) => {
	data = fs.readFileSync('index.html', 'utf8')
	res.send(data)
})

app.get('/json', (req, res) => {
	data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
	res.send(data)
})

app.get('/readAll/:title', (req, res) => {
	
	title = req.params.title
	
	data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
	result = readAll(data, title)
	res.send(result)
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
