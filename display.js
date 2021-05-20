const { 
  People,
  Place,
  Thing,
  Souvenir } = require('./db')

const dispHdr = () => {
  return `
  <html><head><link rel="stylesheet" href="./styles.css"></head>
  <body><h1>People, Places, and Things!</h1><div>
  `
}

async function dispAdd () {
  const [people, place, thing] = await Promise.all([
    People.findAll({order:[['name','ASC']]}),
    Place.findAll({order:[['name','ASC']]}),
    Thing.findAll({order:[['name','ASC']]})
  ])
  let addHtml =  `<section><p>Add new purchase</p><form method='POST' action='/souvenir'>
    <label for="people">Who bought it?</label>
    <select name='personId'>${people.map(c => `<option value='${c.id}'>${c.name}</option>`)}</select>
    <br><label for="place">Where at?</label>
    <select name='placeId'>${place.map(c => `<option value='${c.id}'>${c.name}</option>`)}</select>
    <br><label for="thing">What was bought?</label>
    <select name='thingId'>${thing.map(c => `<option value='${c.id}'>${c.name}</option>`)}</select>
    <br><label for="quantity">How many?</label>
    <input type='number' min='1' max='99' placeholder='#' name='quantity' size='2' value='1' required>
    <br><br><label for="date">When?</label>
    <input id='date' type='date'  name='date' min='2021-01-01' max='2021-12-31' value='2021-05-20'>

    <div id='center'><input id='add' type='submit' value='Create purchase'></div>
    </form></section>

  `
  return addHtml;
}

const dispEnd = () => {
  return '</div></body></html>';
}

const dispMain = async (express, app) => {
  app.use(require('method-override')('_method')); // needed for DELETE method
  app.use(express.urlencoded({extended: false})); // needed for processing the POST

  let data = await People.findAll({order:[['name','ASC']]}); 
  const peopleRows = data.map ( c => `<li>${c.name}</li>`).join('')

  data = await Place.findAll({order:[['name','ASC']]});
  const placeRows = data.map ( c => `<li>${c.name}</li>`).join('')

  data = await Thing.findAll({order:[['name','ASC']]});
  const thingRows = data.map ( c => `<li>${c.name}</li>`).join('')

  data = await Souvenir.findAll({include: [{model: People, required: true}, 
                                           {model: Place, required: true},
                                           {model: Thing, required: true} ]} );
  const souvenirRows = data.map ( c => `<li>${c.person.name} 
    purchased ${c.quantity} ${c.thing.name}(s) 
    in ${c.place.name} 
    on ${c.date}</li>
    <form method='POST' action='/souvenirs/${c.id}?_method=DELETE'><input type='hidden' name='sid' value='${c.id}'><button>X</button></form>`)
    .join('');

  const [peopleCt, placeCt, thingCt, souvenirCt] = await Promise.all([People.count(), Place.count(), Thing.count(), Souvenir.count()]);;

  return dispHdr() + `<section><p>People (${peopleCt})</p><ul>` + peopleRows + '<ul></section>' +
                     `<section><p>Places (${placeCt})</p><ul>` + placeRows + '<ul></section>' +
                     `<section><p>Things (${thingCt})</p><ul>` + thingRows + '<ul></section>' +
                     `<section><p>Souvenirs (${souvenirCt})</p><ul>` + souvenirRows + '<ul></section>' +
                     await dispAdd() +
                     dispEnd()
}

module.exports = {
  dispMain
}