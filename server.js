const express = require('express');
const bodyParser = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static('public'));
 
 //connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
	  useNewUrlParser: true
});

const SalesSchema = new mongoose.Schema({
	name: String,
	date: String,
	contractValue: Number,
	commission: Number,
	payed: Boolean,

});

const Sale = mongoose.model('Sale', SalesSchema);

const WeekSchema = new mongoose.Schema({
	number: Number,
	actual: Number,
	total: Number,
});


const Week = mongoose.model('Week', WeekSchema);

app.get('/api/week', async (req, res)=>{
	try{
		let weeks = await Week.find();
		res.send(weeks);
	} catch(error){
		console.log(error);
		res.sendStatus(500);
	}
});

app.post('/api/week', async (req, res)=>{
	const week = new Week({
		number: req.body.weekcount,
		actual: req.body.actual,
	});
	try{
		await week.save();
		res.send(week);
	} catch (error){
		console.log(error);
		res.sendStatus(500);
	}
});

app.delete('/api/week/:id', async (req, res)=>{
	try{
		await Week.deleteOne({
			_id: req.params.id
		});
		res.sendstatus(200);
	} catch (error){
		console.log(error);
		res.sendStatus(500);
	}
})

app.get('/api/sales', async (req, res) =>{
	try{
		let sales = await Sale.find();
		res.send(sales);
	} catch (error){
		console.log(error);
		res.sendStatus(500);
	}
});

app.post('/api/sales', async (req, res) =>{
	const sale = new Sale({
		name: req.body.name,
		date: req.body.date,
		contractValue: req.body.contractValue,
		commission: req.body.commission,
		payed: req.body.payed,
	});
	try{
		await sale.save();
		res.send(sale);
	} catch  (error){
		console.log (error);
		res.sendStatus(500);
	}
});

//these two functions alter the payed and delete variable inside the document. 
app.put('/api/sales/:_id', async (req, res)=>{
	try{
		let sale = await Sale.findOne({
			_id: req.params._id,
		});
	  sale.payed = !sale.payed;
		sale.save();
		res.sendStatus(200);
	} catch (error){
		console.log(error);
		res.sendStatus(500);
	}
});
//go through and delete all of the values that are checked. 
app.delete('/api/sales/:_id', async(req, res) => {
	try{
		await Sale.deleteOne({
			_id: req.params._id,
		});
		res.sendStatus(200);
	} catch(error){
		console.log(error);
		res.sendStatus(500);
	}
})

app.listen(3000, () => console.log('Server listening on port 3000!'));


