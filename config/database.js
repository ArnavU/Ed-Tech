const mongoose = require("mongoose");

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Databases Connected Successfully");
    })
    .catch((error) => {
        console.log("DB Connection Failed");
        console.log("Reason: ", error);
        process.exit(1)
    })
}