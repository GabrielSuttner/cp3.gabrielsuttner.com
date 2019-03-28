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

//This will set up a model for all sales objects stored inside the database.
const SalesSchema = new mongoose.Schema({
	name: String,
	date: String,
	contractValue: Number,
	commission: Number,
	paid: Boolean,

});

const Sale = mongoose.model('Sale', SalesSchema);

//retrieval of all of the objects inside of the database "Sale"

 app.get('/api/sales', async (req, res) =>{
	try{
		let sales = await Sale.find();
		res.send(sales);//sends back all the data inside of the variable sales. kind of like a return statement
	} catch (error){
		console.log(error);
		res.sendStatus(500);
	}
});

//adds a new sale into the db.
app.post('/api/sales', async (req, res) =>{
	//creates the object and assignes each of these variables with the information that is passed
	const sale = new Sale({
		name: req.body.name,
		date: req.body.date,
		contractValue: req.body.contractValue,
		commission: req.body.commission,
		paid: req.body.paid,
	});
	 try{
		await sale.save();
		res.send(sale);
	} catch  (error){
		console.log (error);
		res.sendStatus(500);
	}
});

//these two functions alter the paid and delete variable inside the document. 
app.put('/api/sales/:_id', async (req, res)=>{
	try{
		let sale = await Sale.findOne({
			_id: req.params._id,
		});
	  sale.paid = !sale.paid;
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
//sets which port to listen on and the 'server listening ...' is for convenience
app.listen(3000, () => console.log('Server listening on port 3000!'));


