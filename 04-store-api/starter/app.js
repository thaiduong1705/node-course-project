require("dotenv").config();
// async error
require("express-async-errors");

const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// middleware
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// routes

app.get("/", (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

// products route
app.use("/api/v1/products", productsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;
const start = async () => {
    try {
        // connect db
        await connectDB(process.env.MONGO_URI).then(() =>
            console.log("Connected to Mongo")
        );
        app.listen(
            port,
            console.log(`Server is listening on http://localhost:${port}`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
