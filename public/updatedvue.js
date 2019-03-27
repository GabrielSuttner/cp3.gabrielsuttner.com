Vue.config.devtools = true;
let app = new Vue({
  el: '#app',
  data: {
    sales: {},
		week: {},
    		
		totalSales: 0,
		actualSales: '',
		weekCount: 0,
		actual: 0,
		//variables that are used in javascript file but not sent to database or shown on screen
		totalContractValue: 0,
		oldDate: '',
		picked: '',
		payedCommissionTotal: 0,

		//variables that are shown on screen but not in database
		actual: 0,
		salescount: 0,
		commissionTotal: 0,

		//variables that are passed to individual sale
		addedName: '',
    addedPrice: 0,
    addedDate: '',
		payed: false,
		commission: 0,
		
		//viewable sales
		show: 'all',
  },
	//When page is first loaded, these functions are called. 
	created(){
		this.getSales();
	},
	watch: {
	},
	computed: {
		filterdSales(){
			if(this.show === 'not payed'){
				return this.sales.filter(sale => {
					return !this.sale.payed;
				});
			}		
			if(this.show === 'payed'){
				return this.sales.filter(sale => {
					return this.sale.payed;
				});
			}
			return this.sales;
		},
	},
	methods: {
		//getSales is called on start and everytime the database changes. 
		async getSales(){
			try {
				let response = await axios.get("/api/sales")
				this.sales = response.data;
			} catch (error){
				console.log(error);
			}
			this.calcTotal();
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
					payed: false,
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
		async getWeek(){
			try {
				let response = await axios.get("/api/week")
				this.week = response.data;
				return true;
			} catch (error){
				console.log(error);
			}
		},
		async addWeek() {
			try {
				let response = await axios.post("/api/week",{
					weekCount: this.weekCount,
					actualSales: this.actualSales,
				});
				this.getWeek();
				return true;
			} catch (error){
				console.log(error);
			}
		},
		clearValues(){
			this.addedName = '';
			this.addedPrice = '';
			this.commission = 0;
			this.totalContractValue = 0;
			
		},

		calcCommission(){
			if(this.picked == "Quarterly"){
				 this.totalContractValue = this.addedPrice * 4;
			 }
			else{
				this.totalContractValue = this.addedPrice * 6;
			 }
			this.commission = this.totalContractValue * .5;
		},
		calcTotal(){
			let length = this.sales.length;
			this.payedCommissionTotal = 0;
			this.commissionTotal = 0;
			for(let i = 0; i < length; ++i){
					this.commissionTotal += this.sales[i].commission;
					if(this.sales[i].payed == true){
						this.payedCommissionTotal += this.sales[i].commission;
					}
				}
			this.totalSales = this.sales.length;
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
	},
});
