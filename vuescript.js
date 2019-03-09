Vue.config.devtools = true;
let app = new Vue({
  el: '#app',
  data: {
    sales: {},
    number: '',
    addedName: '',
    addedPrice: 0,
    addedDate: '',
    picked: '',
		commission: 0,
		total: 0,
		commissiontotal: 0,
		actual: '',
		goal: '',
		show: 'new',
  },
	computed: {
		},
  watch: {
  },

  methods: {
		clearValues(){
				this.goal = '';
				this.actual = '';
				this.addedName = '';
				this.addedPrice = '';
				this.commission = '';
		},
		calcCommission(){
			if(this.picked == "Quarterly"){
				this.addedPrice *= 4;
      }
			else{
				this.addedPrice *= 6;
      }
			this.commission = this.addedPrice * .5;
		},
		NewDay(){
				Vue.set(app.sales, 1, new Array);
				this.number = 1;
		},
		addSale(){
			this.actual = this.number;
		  this.calcCommission();
			this.sales[1].push({
				name: this.addedName,
				price: this.addedPrice,
				date: this.addedDate,
				goal: this.goal,
				actual: this.actual,
				commission: this.commission,
      });
				this.commissiontotal = this.commissiontotal + this.commission;
				this.total += 1;
				this.number += 1;
				this.clearValues();
					},
		newDay(){
						

		},
  },
		
});

