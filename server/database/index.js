const { Sequelize } = require('sequelize');
const orm = new Sequelize('stories', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

orm.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

const User = orm.define('users', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  badges: Sequelize.STRING
}, {
  timestamps: false
})

const Prompt = orm.define('prompts', {
  name: Sequelize.STRING,
  matchWords: Sequelize.STRING//grabbed with external api
}, {
  timestamps: true
});

const Text = orm.define('texts', {
  text: Sequelize.TEXT,
  likes: Sequelize.INTEGER,
  wordMatchCt: Sequelize.INTEGER
}, {
  timestamps: false
});

User.hasMany(Text);
Text.belongsTo(User);
Prompt.hasMany(Text);
Text.belongsTo(Prompt);

User.sync()
Prompt.sync()
Text.sync()

exports.User = User;
exports.Prompt = Prompt;
exports.Text = Text;

