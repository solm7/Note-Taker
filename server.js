const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const PORT = 3001;
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware for parsing application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// Utility functions
const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);

// GET request for ALL notes
app.get('/api/notes', (req, res) => {
  // Log our request to the terminal
  console.info(`${req.method} notes written to New Note`);
  readFromFile("./db/db.json")
    .then((data) => {
      res.json(JSON.parse(data))
    });

});


// POST request to receive new note and add to file
app.post('/api/notes', (req, res) => {
  const {title, text} = req.body;
  if (title && text) {
    console.info(`${req.method} request received to add new note`);
    const newNote = {
        title,
        text, 
        id: uuidv4(),
    };

    readFromFile("./db/db.json")
    .then((data)=> {
    const notes = JSON.parse(data);
    notes.push(newNote);
    writeToFile("./db/db.json", JSON.stringify(notes));
    });

    const response = {
      status: "success",
      body: newNote,
    }


    res.status(201).json(response);
  } else{
    res.status(500).json(`Unable to post note`);
  }
  
}
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);



//Start server listens at port
app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
