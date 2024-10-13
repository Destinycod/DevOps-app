
const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const productRoute = require("./routes/product");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

const app = express();

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("DB connection successfull"))
.catch((error)=>{
    console.log(error);
});

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

server = app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT || 3000}`);
});

module.exports = server;
module.exports = app;

//prueba