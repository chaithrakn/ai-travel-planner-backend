const mongoose = require('mongoose');
const Hotel = require('../models/hotel');
const fastcsv = require('fast-csv');
const fs = require('fs');

mongoose.connect('mongodb://localhost/sustivo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
db.createCollection();
//db.collection.getPlanCache().clear();

const seedDB = async() => {
    await Hotel.deleteMany({});

    const stream = fs.createReadStream('./EcolodgesDB-Luxury.csv');
    let csvData = [];
    let csvStream = fastcsv
        .parse()
        .on("data", async(data) => {
            // const hotel = new Hotel({
            //     name:data[0],
            //     location:data[1],
            //     country:data[2],
            //     type:data[3],
            //     website:data[4],
            //     description:data[5],
            //     experiences:data[6]
            // });
            csvData.push({
                name:data[0],
                location:data[1],
                country:data[2],
                type:data[3],
                website:data[4],
                description:data[5],
                experiences:data[6]
            });

            //csvData.push(hotel);
            //await hotel.save();
            //console.log(data);
        })
        .on("end", () => {
            //csvData.shift();
            console.log(csvData);
            writetoDB(csvData);
            
        });

    stream.pipe(csvStream);    
}
  
const writetoDB = async(csvData) => {
    let session = await db.startSession();
    session.startTransaction();

    Hotel.insertMany(csvData, {session}, (err,res) => {
        if (err) throw err;

        console.log(`Inserted: ${res.insertedCount} rows`);
    });

    await session.commitTransaction();

}    

seedDB().then(() => {
    mongoose.connection.disconnect();
    mongoose.connection.close();
});