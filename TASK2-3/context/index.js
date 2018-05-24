const config = require('./../config.json');
const Sequelize = require('sequelize');

const options = {
  host: config.db.host,
  dialect: 'mysql',
  logging: false,
  define: {
      defaultScope: {
          attributes: {
              exclude: ['createdAt', 'updatedAt']
          }
      }
  }
};

const sequelizeCentral = new Sequelize(config.db_central.name, config.db.user, config.db.password, options);
const sequelizeClient1 = new Sequelize(config.db_client1.name, config.db.user, config.db.password, options);
const sequelizeClient2 = new Sequelize(config.db_client2.name, config.db.user, config.db.password, options);

const CentralReport = require('./../models/central')(Sequelize, sequelizeCentral);
const Client1Report = require('./../models/client')(Sequelize, sequelizeClient1);
const Client2Report = require('./../models/client')(Sequelize, sequelizeClient2);

module.exports = {
  central: CentralReport,
  client1: Client1Report,
  client2: Client2Report,
  
  sequelizeCentral,
  sequelizeClient1,
  sequelizeClient2,
  Sequelize
};