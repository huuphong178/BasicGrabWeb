window.onload = function() {
	console.log('NL');
	app.setupSSE();
	app.loadRequest();
}

var app = new Vue({
	el: "#app",
	data: {
		list: [
			
		],
		timestamp: 0
	},
	methods:{
		viewDetail: function (index){
			var self = this;
			var item = self.list[index];
			var str = item.id + " - " + item.name + " - " + item.phone + " - "
				+ item.location + " - " + item.status + " - " + item.note + " - " + item.driver;
			//alert(str);
			var tempt = {
				id: item.id,
				name: 'name',
				phone: 'phone',
				address: 'address',
				status: 'status',
				note: 'note',
				driver: 'driver_id'
			}

			var id = item.id;

			self.list.forEach((c, i) => {
				if(c.id == id){
					console.log('ok');
					console.log(i);
					self.list.splice(i, 1, tempt);
					return;
				}
			});
		},
		loadRequest: function(){
			var self = this;
			console.log('run func ');
			var axiosInstance = axios.create({
				baseURL: 'http://localhost:3000/request',
				timeout: 15000
			});

			//axiosInstance.get('/getRequestRealtime?timestamp=' + self.timestamp)
			axiosInstance.get('/')
				.then(function(res) {
					console.log(res.status);
					if(res.status == 200){
						//self.timestamp = res.data.timestamp;
						res.data.forEach((item, index) => {
							var tempt = {
								id: item.id,
								name: item.name,
								phone: item.phone,
								address: item.address,
								status: item.status,
								note: item.note,
								driver: item.driver_id
							}
							self.list.push(tempt);
						})
					}
				}).catch(function(err){
					console.log(err);
				}).then(function() {
					//console.log(self.timestamp);
					//self.loadRequest();
				});
		},
		setupSSE: function(){
			var self = this;
			if (typeof(EventSource) === 'undefined') {
				console.log('not support');
				return;
			}

			var src = new EventSource('http://localhost:3000/requestAddedEvent');

			src.onerror = function(e) {
				console.log('error: ' + e);
			}

			src.addEventListener('REQUEST_ADDED', (e) => {
				var data = JSON.parse(e.data);
				self.list.push(data);
			}, false);
		}
	},
	computed: {
		sortedArray: function() {
		  	function compare(a, b) {
				if (a.id < b.id)
			  		return 1;
				if (a.id > b.id)
			  		return -1;
				return 0;
			}
			return this.list.sort(compare);
		}
	}
})
