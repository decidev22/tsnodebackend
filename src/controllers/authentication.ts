import express from "express";

import { createUser, getUserByEmail, getUserById } from "../db/users";
import { authentication, random } from "../helpers";

//The async and await keywords enable asynchronous, promise-based behavior to be written in a cleaner style, avoiding the need to explicitly configure promise chains.
//The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
export const login = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password" //+ symbol is used as a prefix to indicate that certain fields should be included in the query result, even if they are not specified in the select() method.
    ); //require the selection part to access authentication.salt at expectedHash

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(
      user.authentication.salt,
      password
    );
    //We have made so that authentication.password gets selected.
    //with provided password from client, if user.authentication.password does not return hash of what we expect from bd,
    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403); //return failed attempt to sign in.
    }

    const salt = random(); // this does 128byte random generation converted to base64 string.
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();

    res.cookie("Andy-Auth", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      console.log("A");
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log("B");
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
