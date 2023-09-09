const { Sequelize } = require('sequelize');
const orm = new Sequelize('stories', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

try {
  await orm.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const User = orm.define('users', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  posts: Sequelize.ARRAY,
  badges: Sequelize.ARRAY
}, {
  timestamps: false
})

const Entry = orm.define('entry', {
  texts: Sequelize.ARRAY,
  matchWords: Sequelize.ARRAY, //connect with extrnal API
}, {
  timestamps: true
});

const Text = orm.define('text', {
  text: Sequelize.STRING,
  likes: Sequelize.NUMBER,
  wordMatchCt: Sequelize.NUMBER
}, {
  timestamps: false
});

User.hasMany(Text);
Text.belongsTo(User);
Entry.hasMany(Text);
Text.belongsTo(Entry);

User.sync()
Entry.sync()
Text.sync()

exports.User = User;
exports.Entry = Entry;
exports.Text = Text;

