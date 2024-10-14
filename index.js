const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();
const productRoute = require("./routes/product");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const app = express();

  // Conexión a la base de datos e inicializacion de Sentry solo si no estamos en el entorno de pruebas
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URL)
      .then(() => console.log("DB connection successful"))
      .catch((error) => {
        Sentry.captureException(error);
        process.exit(1);
      });
      Sentry.init({
        dsn: process.env.SENTRY_DSN, 
        integrations: [
          // enable HTTP calls tracing
          new Sentry.Integrations.Http({ tracing: true }),
          // enable Express.js middleware tracing
          new Tracing.Integrations.Express({ app }),
        ],
        tracesSampleRate: 1.0,
      });
}

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.get('/debug-sentry', function mainHandler(req, res) {
    throw new Error('My first Sentry error!');
});

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

module.exports = app;
