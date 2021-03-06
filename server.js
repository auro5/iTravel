var express = require('express');
var cors = require('cors');
const request = require('request');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(cors())
app.use(express.static(__dirname + '/public'))
app.get('/geocode', function(req, resp) {
	var term = req.query.locterm;

        request.get('https://maps.googleapis.com/maps/api/geocode/json?address='+term+'&key=xxxxxxxxxxxxxxxx' , { json: true }, (err, res, body) => {
	if (err) {
            resp.write("error");
	    resp.end(); 
	}
	resp.json(body);
 	resp.end();
	});
});

app.get('/places', function(req, resp){
	var key = req.query.key;
	var cat = req.query.category;
	var dist = req.query.dist;
	var lat = req.query.latitude;
	var lon = req.query.longitude;
	console.log(key+cat+dist+lat+lon);
	request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lon+'&radius='+dist+'&type='+cat+'&keyword='+key+'&key=xxxxxxxxxxx' , { json: true }, (err, res, body) => {
	if (err) {
	    resp.write("error");
	    resp.end(); 
	}
	resp.json(body);
	resp.end();
	});
});

app.get('/nextpage', function(req, resp) {
	var token = req.query.token;
   	console.log(token);
    	request.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken='+token+'&key=xxxxxxxxxxxxxxxxxxxxx' , { json: true }, (err, res, body) => {
	if (err) {
        	resp.write("error");
		resp.end(); 
	}
   	resp.json(body);
   	resp.end();
   	});
});

'use strict';
 
const yelp = require('yelp-fusion');
 
const client = yelp.client('xxxxxxxxxxxxxxxxxxxxxxxx');
app.get('/yelpbm', function(req, resp) {
	client.businessMatch('best', {
	name: req.query.name,
  	address1: req.query.address,
  	city: req.query.city,
  	state: req.query.state,
  	country: req.query.country
	}).then(response => {
  		resp.send(response.jsonBody);
  		resp.end();
	}).catch(e => {
  		resp.send("ERROR");
  		resp.end();
	});
});

app.get('/yelpbr', function(req, resp) {
	client.reviews(req.query.id).then(response => {
  	resp.send(response.jsonBody);
  	resp.end();
	}).catch(e => {
  		console.log(e);
	});
});

//app.listen(3000);
var port= process.env.PORT || 8081
app.listen(port, function() {
	console.log("Server started");
});
