Vue.config.devtools = true;
let app = new Vue({
  el: '#app',
  data: {
    sales:[],
		filteredSalesArray: [],
    		
		totalSales: 0,
		actualSales: '',
		weekCount: 0,
		actual: 0,
		//variables that are used in javascript file but not sent to database or shown on screen
		totalContractValue: 0,
		oldDate: '',
		picked: '',
		paidCommissionTotal: 0,

		//variables that are shown on screen but not in database
		actual: 0,
		salescount: 0,
		commissionTotal: 0,

		//variables that are passed to individual sale
		addedName: '',
    addedPrice: 0,
    addedDate: '',
		paid: false,
		commission: 0,
		
		//viewable sales
		showSales: 'All',
  },
	//When page is first loaded, these functions are called. 
	created(){
		this.getSales();
	},
	watch: {
	},
	computed: {	
	},
	methods: {
		//getSales is called on start and everytime the database changes. 
		async getSales(){
			try {
				let response = await axios.get("/api/sales");
				this.sales = response.data;
			} catch (error){
				console.log(error);
			}
			this.calcTotal();
			this.filteredSales();
		},
		//addSale will add one new sale to the database. 
		async addSale() {
			if(this.addedName == ''){
				return true;
			}
			this.calcCommission();
			this.oldDate = this.addedDate;
			try {
				let r1 = await axios.post("/api/sales",{
					name: this.addedName,
					date: this.addedDate,
					contractValue: this.totalContractValue,
					commission: this.commission,
					paid: false,
				});
				//call functions that incriment local variables. 
				this.salescount += 1;
				this.getSales();
				this.calcTotal();
				this.clearValues();
				return true;
			} catch (error){
				console.log(error);
			}
		},
		async deleteSale(sale){
			try{
				let response = axios.delete('/api/sales/' + sale._id);
				this.getSales();
				return true;
			} catch (error){
				console.log(error)
			}
		},
		//changes the 'paid' variable inside of the database to !paid. then to change the information on screen two functions are called. 
		async paySale(sale){
			try{
				let response = await axios.put("/api/sales/" + sale._id);
				await this.getSales();
				this.calcTotal();
				return true;
			} catch (error){
				console.log(error);
			}
		},
		 //reset all of the values except for the date because that is reused. 
		clearValues(){
			this.addedName = '';
			this.addedPrice = 0;
			this.commission = 0;
			this.totalContractValue = 0;
			
		},
		//calculates the commission from each sale and the total contract value of each sale. 
		calcCommission(){
			if(this.picked == "Quarterly"){
				 this.totalContractValue = this.addedPrice * 4;
			 }
			else{
				this.totalContractValue = this.addedPrice * 6;
			 }
			this.commission = this.totalContractValue * .5;
		},
		//calculates the total commission and total commission paid and outputs it onto the screen. 
		calcTotal(){
			let length = this.sales.length;
			this.paidCommissionTotal = 0;
			this.commissionTotal = 0;
			for(let i = 0; i < length; ++i){
					this.commissionTotal += this.sales[i].commission;
					if(this.sales[i].paid == true){
						this.paidCommissionTotal += this.sales[i].commission;
					}
				}
			this.sales.length;
		},
		showAll(){
			this.showSales = 'All';
			this.filteredSales();
		},
		showUnpaid(){
			this.showSales = 'Unpaid';
			this.filteredSales();
		},
		showPaid(){
			this.showSales = 'Paid';
			this.filteredSales();
		},
		filteredSales(){
			if(this.showSales === 'Unpaid'){
				this.filteredSalesArray = this.sales.filter(sale => {		
						return !sale.paid;			
				});
			}
			if(this.showSales === 'Paid'){
				this.filteredSalesArray = this.sales.filter(sale => {
					return sale.paid;
				});
			}
			if(this.showSales === 'All'){
				this.filteredSalesArray = this.sales;
			}
		},
		//filteredSales(){
		//	if(this.showSales === 'Unpaid'){
		//		this.filteredSalesArray = this.sales.filter(sale => {
		//			return !sale.paid;
		//		});
		//	}
		//	if(this.showSales === 'Paid'){
		//		this.filteredSalesArray = this.sales.filter(sale => {
		//			return sale.paid;
		//		});
		//	}
		//	this.filteredSalesArray =  this.sales;
		//}

	},
});
