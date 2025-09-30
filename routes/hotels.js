const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotel');
const {isLoggedIn} = require('../middleware');
const dotenv = require('dotenv').config();

// google maps
const {Client} = require("@googlemaps/google-maps-services-js");
const geocoder = new Client({key:"AIzaSyB7HYItQ6FrtnCG_WBRtMlUSB41PFETnyA"});

// get all hotels
router.get('/hotels', async (req, res) => {
    const hotels = await Hotel.find({});
    res.render('hotels/index', { hotels })
})

// add a new hotel. Make sure this is before app.get('/hotels/:id')
router.get('/hotels/new', isLoggedIn, (req,res) => {
    res.render('hotels/new');
})

// get one hotel by id
router.get('/hotels/:id', async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    res.render('hotels/show', { hotel });
})

//  api "/hotels/new" will call this post request. Check new.ejs
router.post('/hotels', isLoggedIn, async(req,res, next) => {
    const hotel = new Hotel(req.body.hotel);
    const loc = `${hotel.name}, ${hotel.location}, ${hotel.country}`;
    console.log(loc);

    await geocoder.geocode({params:{
            address: loc,
            key: 'AIzaSyB7HYItQ6FrtnCG_WBRtMlUSB41PFETnyA'
        }
    })
    .then(res => {
        hotel.geometry.type = 'Point';
        hotel.geometry.coordinates[0] = res.data.results[0].geometry.location.lat;
        hotel.geometry.coordinates[1] = res.data.results[0].geometry.location.lng;
    })
        .catch(e => {
        console.log(e);
    });

    console.log(hotel);
    
    await hotel.save();
    req.flash('success', 'Successfully added a hotel');
    res.redirect(`/hotels/${hotel._id}`);
})

// edit one hotel
router.get('/hotels/:id/edit', isLoggedIn, async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    res.render('hotels/edit', { hotel });
})

// called by edit.
router.put('/hotels/:id', isLoggedIn, async(req,res) => {
    const {id} = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id, {...req.body.hotel});
    res.redirect(`/hotels/${hotel._id}`);
})

// delete one hotel
router.get('/hotels/:id/delete', isLoggedIn, async (req, res) => {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    const hotels = await Hotel.find({});
    req.flash('success', 'Deleted one hotel');
    res.render('hotels/index', { hotels })
})

module.exports = router;