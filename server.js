'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');



const app = express();

// Import our controllers from their files. Notice how we're
// giving the `require` built-in function the path a file
// locally instead of a dependency that was installed as
// specified in our `package.json` file, like "express".
const indexControllers = require('./controllers/index.js');

// Configure our "templating engine", which is
// Mozilla's "Nunjucks" in this case.
const nunjucks = require('nunjucks');

// Through this configuration, Nunjucks will "tell"
// our Express app that it is handling the templates,
// so that when we call the `render` function on a
// response object, it will rely on Nunjucks.
nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
  extended: true,
})); // for parsing application/x-www-form-urlencoded

// function to valdiate email through regex
/*
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
*/

// Now, attach our "controllers" to our "routes".
app.get('/', indexControllers.index);

app.get('/about', function (req, res) {
  res.render('about');
});


app.get('/events/:param', function (req, res) {
  var param = req.params.param;
  if (param.toString() == "new") {
  	res.render('new');
  }
  else{
  	  res.render('event');

  }
})

/*app.get('/events/new', function (req, res) {
  res.render('new');
}); */

function ValidURL(str) {
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  if(!pattern.test(str)) {
    alert("Please enter a valid URL.");
    return false;
  } else {
    return true;
  }
}

app.post('/events/:param', function (req, res) {
	console.log(req.body);

		//console.log(req.body.title.length);

	var param = req.params.param;

	if (param.toString() === "new")
	{


		if (req.body.title.length === 0 || req.body.title.length > 50) {
		 //res.locals.errors = "Title was not invalid";
		 //return res.redirect('/about');

		 return res.render('event', {errors: ['Bad Title'],});
		}

		if (req.body.location.length === 0 || req.body.location.length > 50) {
			
			return res.redirect('/about');

			res.locals.errors = "Location was not valid";
		}
		if (!validUrl.isUri(req.body.image)) {

			return res.redirect('/about');

			res.locals.errors = "Invalid image";

		}
		var length = req.body.image.length;
		var image_extension = req.body.image.substring(length - 5, length - 1);
		if (image_extension !== ".png" ||
			image_extension !== ".gif" ||
			image_extension !== ".jpg") 
		{

			res.locals.errors = "Invalid image extensions";
		}
		res.redirect('/');
	}

	
});
// Start up the application and listen on the specified
// port, or default to port 4000.
app.listen(process.env.PORT || 8000);
