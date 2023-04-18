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
            images: [
                {
                    url: 'https://res.cloudinary.com/dblpfqf7l/image/upload/v1681781836/YelpCamp/oqei1rammwrccry8my2y.jpg',
                    filename: 'CampProject/oqei1rammwrccry8my2y'
                },
                {
                    url: 'https://res.cloudinary.com/dblpfqf7l/image/upload/v1681785591/CampProject/qi4dxo2cqof2f5z9omb1.jpg',
                    filename: 'CampProject/qi4dxo2cqof2f5z9omb1'
                },
            ]
        })
        const geoData = await geocoder.forwardGeocode({
            query: newCamps.location,
            limit: 1
        }).send()
        newCamps.geometry = geoData.body.features[0].geometry;
        await newCamps.save();
    }

}

// closing the database connection
seedDB().then(() => {
    mongoose.connection.close();
});