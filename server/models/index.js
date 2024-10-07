const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables

// Initialize Sequelize using environment variables
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT || 3306,
    dialect: 'mysql',
    logging: false, // Disable logging for a cleaner console
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to MySQL has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the MySQL database:', err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);

// Dynamic Todo model creation (in case you have dynamic table names)
db.getTodoModel = (tableName) => require('./todo')(sequelize, Sequelize, tableName);

module.exports = db;
