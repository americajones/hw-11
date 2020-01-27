const express = require("express");
const path = require("path");
const fs = require("fs");

const jsonStuff = fs.readFileSync("./db/db.json");

//sets up express app
const app = express();
const PORT = process.env.PORT || 3030;
//to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//make server listen
app.listen(PORT, () => {
    console.log("App listening on PORT: " + PORT);
});
//routes

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  fs.readFile("./db/db.json", (err, data) => {
      if (err) throw err;

      const parsed =  JSON.parse(data);
      return res.json(parsed);
  })
  // fs.readFile("./db/db.json", (err, data) => {
    //     if (err) throw err;
    //     const readNotes = JSON.parse(data);
    //     return res.json(readNotes);
    // })
})

//recieves note, adds ID, adds it to JSON file and returns new note frontside
app.post("/api/notes", function(req,res) {
    const newNote = req.body;
    newNote.id = newNote.title.replace(/\s+/g,"").toLowerCase();
    newNote.id = newNote.id + Math.floor(Math.random() * 1000);
    console.log(newNote);

    res.json(true);
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        let note = JSON.parse(data);
        note.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(note), "utf8", (err) => {
            if (err) throw err;
            console.log("Written!");
        });
        
    })
    
});
//recieves query parameter with ID of specified note, reads through all notes in JSON and deletes the one with given ID, then rewrites notes to json file
app.delete(`/api/notes/:id`, function(req, res) {
    let json = fs.readFileSync("./db/db.json");
    const parsed =  JSON.parse(json);
    let deleteNoteID = req.params.id;
    let deleteObj = parsed.find(data => data.id == deleteNoteID);
    let deleteIndex = parsed.indexOf(deleteObj);
    parsed.splice(deleteIndex,1);
    res.send(deleteObj);

    fs.writeFile("./db/db.json", JSON.stringify(parsed), (err) => {
                             if (err) throw err;
                             console.log("deleted??");
                         })
                      })

    // for (let i=0; i < parsed.length; i=0) {
    //              if (parsed[i].id === chosenNote) {
    //                  delete parsed[i];
    //                  res.json(parsed);
    //                  fs.writeFile("./db/db.json", JSON.stringify(parsed), (err) => {
    //                     if (err) throw err;
    //                     console.log("deleted??");
    //                 })
    //              }
    //          }


//     let rawData = fs.readFileSync("./db/db.json");
//     let notes = JSON.parse(rawData);
//     let chosenNote = req.params.id;
//     for (let i=0; i < notes.length; i=0) {
//         if (notes[i].id === chosenNote) {
//             delete notes[i];
//         }
//     }
//     console.log(notes);
// res.json(notes);


// }) 
