const { Sequelize, DataTypes } = require('sequelize');
const orm = new Sequelize('stories', 'root', '', {
  host: '127.0.0.1',
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
  matchWords: Sequelize.STRING//grabbed with external api
}, {
  timestamps: true
});

const Badges = orm.define('badges', {
  mostLikes: {
    type: DataTypes.STRING,
    defaultValue: 'No winner yet'
  },
  mostWordMatchCt: {
    type: DataTypes.STRING,
    defaultValue: 'No winner yet'
  }
}, {
  timestamps: false
});

const Text = orm.define('texts', {
  text: Sequelize.TEXT,
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  wordMatchCt: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: false
});

User.hasMany(Text);
Text.belongsTo(User);
Prompt.hasMany(Text);
Text.belongsTo(Prompt);
Prompt.hasOne(Badges);
Badges.belongsTo(Prompt);

User.sync()
Prompt.sync()
Text.sync()
Badges.sync()

exports.User = User;
exports.Prompt = Prompt;
exports.Text = Text;
exports.Badges = Badges;

