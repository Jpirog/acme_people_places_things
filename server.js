const express = require("express");
const morgan = require("morgan");
const {dispMain} = require('./display')

const app = express();
app.use(morgan("dev"));
app.use(express.static(__dirname + "/public")); // allows for CSS files and others
app.use(express.urlencoded({extended: false})); // needed for processing the POST
app.use(require('method-override')('_method')); // needed for DELETE method

//const routes = require('./routes')
//app.use('/bookmarks', routes)

const { syncAndSeed,
        deleteSouvenir} = require('./db')

syncAndSeed(); // initialze the database

app.get('/', async (req, res, next) => {
  try {
    const data = await dispMain(express, app);
    res.send(data);
  }
  catch(ex) {
    next(ex);
  }
});
 
app.delete('/souvenirs/:sid', async (req, res, next) => {
  try{
    console.log("DELETING", req.params)
    await deleteSouvenir(req.params.sid)
    res.redirect('/')
  }
  catch (ex) {
    next(ex);
  }
});

const PORT = 1340;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});