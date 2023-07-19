const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDb = require("./db/connect");

const app = express();
const tasks = require("./routes/tasks");

const notFound = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const port = 8000;

// app.use(express.static("./public"));
app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "PATCH", "DELETE"],
    })
);
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use("/api/v1/tasks", tasks);
app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await connectDb(process.env.MONGO_URI).then(() =>
            console.log("Connected to Mongo")
        );
        app.listen(port, console.log(`Server is on http://localhost:${port}/`));
    } catch (error) {
        console.log(error);
    }
};
start();
