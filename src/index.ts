//Here, we are setting up the server and running the express app

import express from "express";
import http from "http";
//Node.js body parsing middleware.
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
import bodyParser from "body-parser";
//Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
import cookieParser from "cookie-parser";
//Node.js compression middleware is used to compress the HTTP response data before sending it to the client.
import compression from "compression";
//CORS (Cross-Origin Resource Sharing) is a mechanism used by web browsers to allow web pages to access resources from a different domain.
import cors from "cors";

import mongoose from "mongoose";

import router from "./router";

const app = express();
app.use(
  cors({
    credentials: true, //enables cors with cred. allowing requests from other domains to access app's resources.
  })
);

//setup app by adding middelware functions
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

//create server
const server = http.createServer(app); //http module creates http server
server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});

//serup mongoose
const MONGO_URL =
  "mongodb+srv://hamento22:1oRx0ceay78UA5nm@cluster0.451x8eh.mongodb.net/?retryWrites=true&w=majority";

mongoose.Promise = Promise; //Not needed in new versions, including this one. but needed in older versions.
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

//
//mounting routes defined in router object at the '/' root path
//when '/' is called by user the routes defeined in the router object will handle the request.
app.use("/", router());
