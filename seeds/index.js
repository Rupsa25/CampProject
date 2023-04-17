const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const camp = require('../models/camp');

const { places, descriptors } = require('./helper');
const cities = require('./cities');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error: "));
db.once('open', () => {
    console.log('Database Connected');
})
//for the title sampling places and descriptors
const sample = array => array[Math.floor(Math.random() * array.length)];

//creation of the camps
const seedDB = async () => {
    await camp.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const priceVal = Math.floor(Math.random() * 30)
        const newCamps = new camp({
            author: '643a46eb03a88a60dc123465',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Looking started he up perhaps against. How remainder all additions get elsewhere resources. One missed shy wishes supply design answer formed. Prevent on present hastily passage an subject in be. Be happiness arranging so newspaper defective affection ye. Families blessing he in to no daughter.This gibbersish is supposed to make content here with some space being taken up.',
            price: priceVal,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dblpfqf7l/image/upload/v1681597768/CampProject/mxacdu1673kmskpbuqa9.jpg',
                    filename: 'CampProject/mxacdu1673kmskpbuqa9'
                },
                {
                    url: 'https://res.cloudinary.com/dblpfqf7l/image/upload/v1681597768/CampProject/jgbq70wklowtelkppmgh.jpg',
                    filename: 'CampProject/jgbq70wklowtelkppmgh'
                },
                {
                    url: 'https://res.cloudinary.com/dblpfqf7l/image/upload/v1681597768/CampProject/kod24kmbq1bebfcvo5gq.jpg',
                    filename: 'CampProject/kod24kmbq1bebfcvo5gq'
                },
            ]
        })
        // const geoData = await geocoder.forwardGeocode({
        //     query: newCamps.location,
        //     limit: 1
        // }).send()
        // newCamps.geometry = geoData.body.features[0].geometry;
        await newCamps.save();
    }

}

// closing the database connection
seedDB().then(() => {
    mongoose.connection.close();
});