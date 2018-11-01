window.onload = function() {
	console.log('NL');
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
			var item = this.list[index];
			var str = item.id + " - " + item.name + " - " + item.phone + " - "
				+ item.location + " - " + item.status + " - " + item.note + " - " + item.driver;
			alert(str);
		},
		loadRequest: function(){
			var self = this;
			console.log('run func');
			var axiosInstance = axios.create({
				baseURL: 'http://localhost:3000/request',
				timeout: 15000
			});

			axiosInstance.get('/getRequestRealtime?timestamp=' + self.timestamp)
				.then(function(res) {
					console.log(res.status);
					if(res.status == 200){
						self.timestamp = res.data.timestamp;
						res.data.arr.forEach((item, index) => {
							var tempt = {
								id: item.id,
								name: item.name,
								phone: item.phone,
								location: item.location_x,
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
					console.log(self.timestamp);
					self.loadRequest();
				});
		}
	}
})
