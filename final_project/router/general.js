const axios = require("axios");
const express = require("express");
let books = require("./booksdb.js");
let doseExist = require("./auth_users.js").doseExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!doseExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});
module.exports.general = public_users;
