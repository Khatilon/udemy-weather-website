import path from 'path';
import express from 'express';
import hbs from 'hbs';
import axios from 'axios';
import bodyParser from 'body-parser';
import { geoCode, forecast } from './utils/functionLibary.js';

// through the node's modulue "path" to get the __dirname

const __dirname = path.resolve();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

const app = express();


// Setup handlebars engine and views location
// use the template engine and npm hbs
// we can see the view engine and views in the documents on the express website
app.set('view engine', 'hbs'); // let view engine = .hbs file
app.set('views', viewsPath); // redirect the views url.
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath)); // express.static can provide some static file like .html / .css / .js

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// if the direct is correct in publicDirectoryPath. Below route will not carried out.
app.get('', (req, res) => {
    // fit the views folder's file
    // if the folder's name is not views, we need to redirect by the const of viewsPath
    res.render('index', {
        title: 'Weather App',
        name: 'Ray CS Lei'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Ray CS Lei'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Ray CS Lei'
    });
});

// backend setup the API server

app.get('/weather', (req, res) => {
    
    console.log(req.query);
    if (!req.query.address) {
        return (
            res.send({
                error: "Please input the address on url"
            })
        );
    }

    geoCode(req.query.address, (geoErrorMessage, {latitude, longitude, location} = {}) => {
        console.log("----GeoCode function Run");
        if (geoErrorMessage) {
            console.log("Geo Error!!!!", geoErrorMessage);
            return res.send({geoErrorMessage});
        }
        forecast(latitude, longitude, (foreErrorMessage, foreCastData) => {
            console.log("----ForcastCode function Run");
            if (foreErrorMessage) {
                console.log("Forecast Error!!!!", foreErrorMessage);
                return res.send({foreErrorMessage});
            }
            console.log(foreCastData);
            res.send(foreCastData);
        })
    })

    // res.send({
    //     forecast: 'sunny',
    //     location: 'Taiwan',
    //     address: req.query.address
    // });
});

app.get('/products', (req, res) => {
    // http://localhost:3000/products/?search=games&rating=5
    if (!req.query.search) {
        // res.send can not send twice, so if the road go here.
        // We need to set return to avoid the second's res.send of product
        return (res.send({
            error: 'You must provide a search term'
        }));
    }
    console.log("req.query:", req.query);
    res.send({
        products: []
    });
});

// Below is the test api for postman which route follow bellow

app.get('/test/data', (req, res) => {
    res.send({
        forecast: 'sunny',
        location: 'Taiwan',
        name: 'ray'
    })
});

app.get('/test/api', (req, res) => {
    axios.get('https://randomuser.me/api/?results=3')
    .then((apiRes) => {
        // console.log(apiRes.data);
        res.send(apiRes.data);
    })
});

app.post('/test/apipost', (req, res) => {
    console.log(req.body);
    res.send(req.body.name);
});

// avoid stupid

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    // res.send('My 404 page');
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found',
        name: 'Ray CS Lei'
    });
});


// app.com
// app.com/help
// app.com/about

app.listen(3000, () => {
    console.log('Server is up on port 3000.');
});