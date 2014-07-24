
module.exports = function(app, http) {

	http.get('/index', function(req, res) {
		res.sendfile(app.getBase() + '/views/index.html');
	});

}