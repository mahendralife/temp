//http://stackoverflow.com/questions/35216601/angular-url-removing-using-express-to-route-request
app.get(/^((?!\/(api)).)*$/, function (req, res) {
	res.render('index');
});
