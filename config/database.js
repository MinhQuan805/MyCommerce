const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect Success");
    }
    catch(err) {
        console.log(`Connect Error: ${err}`);
    }
}
module.exports = connection;