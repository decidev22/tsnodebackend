import express from "express";
import authentication from "./authentication";
import users from "./users";

//method in the Express.js framework that returns an instance of a router object
//it's like a map.
const router = express.Router();

export default (): express.Router => {
  //adding authentication routes to router - check if the user is allowed to access
  authentication(router);
  //show user info
  users(router);
  return router;
};
