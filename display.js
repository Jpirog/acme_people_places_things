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
    purchased ${c.thing.name} 
    in ${c.place.name} 
    on ${c.createdAt.getMonth()+1}/${c.createdAt.getDate()}/${c.createdAt.getFullYear()}</li>
    <form method='POST' action='/souvenirs/${c.id}?_method=DELETE'><input type='hidden' name='sid' value='${c.id}'><button>X</button>`)
    .join('');

  const [peopleCt, placeCt, thingCt, souvenirCt] = await Promise.all([People.count(), Place.count(), Thing.count(), Souvenir.count()]);;

  return dispHdr() + `<section><p>People (${peopleCt})</p><ul>` + peopleRows + '<ul></section>' +
                     `<section><p>Places (${placeCt})</p><ul>` + placeRows + '<ul></section>' +
                     `<section><p>Things (${thingCt})</p><ul>` + thingRows + '<ul></section>' + 
                     `<section><p>Souvenirs (${souvenirCt})</p><ul>` + souvenirRows + '<ul></section>' + dispEnd()
}

module.exports = {
  dispMain
}