const data = {
  people: ['moe', 'larry', 'lucy', 'ethyl'],
  places: ['paris', 'nyc', 'chicago', 'london'],
  things: ['foo', 'bar', 'bazz', 'quq']
};

const Sequelize = require('sequelize');
const {STRING, INTEGER, DATEONLY} = Sequelize;

const db = new Sequelize('acme_people_places_things', 'postgres', 'FSA123', {
  host:'localhost',
  post:'5432',
  dialect: 'postgres',
   logging: false,
  autocommit: true
})

const People = db.define('people', {
  name: { type: STRING, allowNull: false, unique: true}
})
const Place = db.define('place', {
  name: { type: STRING, allowNull: false, unique: true}
})
const Thing = db.define('thing', {
  name: { type: STRING, allowNull: false, unique: true}
})
const Souvenir = db.define('souvenir', {
  quantity: { type: INTEGER, allowNull: false, unique: false},
  date: { type: DATEONLY, allowNull: false, unique: false}
})
Souvenir.belongsTo(People);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);
People.hasMany(Souvenir);
Place.hasMany(Souvenir);
Thing.hasMany(Souvenir);


async function syncAndSeed () {
  await db.sync({force:true});
  await data.people.forEach(c => People.create({name: c}))
  await data.places.forEach(c => Place.create({name: c}))
  await data.things.forEach(c => Thing.create({name: c}))
}

async function deleteSouvenir (id) {
  await Souvenir.destroy({
    where: {
      id: [id]
    }})
}

async function addSouvenir (form) {
  const add = new Souvenir(form);
  await add.save();
}

module.exports = {
  syncAndSeed,
  People,
  Place,
  Thing,
  Souvenir,
  deleteSouvenir,
  addSouvenir
}
