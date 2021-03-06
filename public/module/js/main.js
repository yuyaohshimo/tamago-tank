(function () {
	var socket = io.connect('/');
	var tamagoList = {};
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var vp = $.viewport();
	$(canvas)
	.attr({
		width: vp.window.width,
		height: vp.window.height,
	});
	var Tamago = function () {
		var self = this;
		self.img = new Image();
		self.img.src = './module/img/tamago_main.png';
		self.img.onload = function () {
			self.draw();
		};
		self.x = 0;
		self.y = 0;
		self.angle = 0;
		self.mod = 1;
		self.speed = 10;
	};
	Tamago.prototype = {
		devicemotion: function (acgX, acgY) {
			var self = this;
			self.angle += acgX;
			if (acgY > -2) {
				self.speed = 10;
			} else {
				self.speed = -10;
			}
		},
		draw: function () {
			var self = this;
			self.x += (self.speed * self.mod) * Math.cos(Math.PI / 180 * self.angle);
			self.y += (self.speed * self.mod) * Math.sin(Math.PI / 180 * self.angle);
			ctx.save();
			ctx.translate(self.x, self.y);
			ctx.rotate(Math.PI / 180 * self.angle);
			ctx.drawImage(self.img, 0, 0);
			ctx.restore();
		},
		test: function () {
			var self = this;
			window.addEventListener('keydown', function (e) {
				if (e.keyCode === 87) { // w
					self.angle -= 1;
				} else if (e.keyCode === 83) { // s
					self.angle += 1;
				}
			});
		}
	};

	// for test
	// tamagoList['test'] = new Tamago();
	// tamagoList['test'].test();

	var timer = setInterval(function () {
		ctx.clearRect(0, 0, vp.window.width, vp.window.height);
		Object.keys(tamagoList).forEach(function (key) {
			tamagoList[key].draw();
		});
	}, 100);

	socket.on('add', function (e) {
		// console.log(e.id);
		tamagoList[e.id] = new Tamago();
		tamagoList[e.id].test();
	});

	socket.on('leave', function (e) {
		// console.log(e.id);
		delete tamagoList[e.id];
	});

	socket.on('devicemotion', function (e) {
		// console.log('devicemotion');
		// console.log(e);
		// console.log(e.id);
		tamagoList[e.id].devicemotion(e.e.acg.x, e.e.acg.y);
	});

})();