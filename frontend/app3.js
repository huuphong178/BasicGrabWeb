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
			// alert(str);
			if(item.status != 2){
				swal("Cảnh báo!", "Yêu cầu chưa được xác nhận", "error");
			}else{
				$('#myModal').modal('show');
				myModal.loadModal(item.id);
			}
			
			
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

			var src = new EventSource('http://localhost:3000/requestEvent');

			src.onerror = function(e) {
				console.log('error: ' + e);
			}

			src.addEventListener('REQUEST_ADDED', (e) => {
				var data = JSON.parse(e.data);
				self.list.push(data);
			}, false);

			src.addEventListener('REQUEST_MODIFIED', (e) => {
				var data = JSON.parse(e.data);
				var id = data.id;
				self.list.forEach((c, i) => {
					if(c.id == id){
						self.list.splice(i, 1, data);
						return;
					}
				});
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
});

var myModal = new Vue({
	el: "#myModal",
	data: {
		value: 'Đây là tiêu đề',
		map: null,
		directionsDisplay: null
	},
	methods: {
		loadModal: function(id) {
			var self = this;
			var axiosInstance = axios.create({
				baseURL: 'http://localhost:3000/request',
				timeout: 15000
			});
			
			axiosInstance.get('/minway/' + id)
				.then((res) => {
					console.log(res);
					self.value = res.data;
					//initMap();
					var A = {lat: +res.data.driver_loX, lng: +res.data.driver_loY};
					var B = {lat: +res.data.request_loX, lng: +res.data.request_loY};
					self.direction(A, B);
				}).catch((err) => {
					console.log(err);
				}).then(() => {

				});
		},
		direction: function(A, B){
			var self = this;
			self.directionsDisplay = new google.maps.DirectionsRenderer({preserveViewport: true});
			var directionsSvc = new google.maps.DirectionsService();
			var center = {lat: (A.lat + B.lat)/2, lng: (A.lng + B.lng)/2}
			self.map.setCenter(center);
			self.directionsDisplay.setMap(self.map);
			var directionsRequest = {
				origin: A,
				destination: B,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};
			
			directionsSvc.route(directionsRequest, function(result, status){
				if (status == google.maps.DirectionsStatus.OK){
					self.directionsDisplay.setDirections(result);
					self.map.setZoom(13);
				}
				else
					alert(status);
			});
		}
	}
});

function initMap() {
	myModal.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		//center: { lat: 10.7624176, lng: 106.68119679999995 },
		fullscreenControl: false
	});
}

$('#myModal').on('hidden.bs.modal', function () {
	myModal.directionsDisplay.setMap(null);
})
