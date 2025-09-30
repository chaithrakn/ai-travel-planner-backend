const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
    name: String,
    location: String,
    country: String,
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    type: String,
    website: String,
    description: String,
    experiences: String
});

module.exports = mongoose.model('Hotel', HotelSchema);