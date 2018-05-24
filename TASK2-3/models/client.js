module.exports = (Sequelize, sequelize) => {
  return sequelize.define('report', {
    'id': { type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    'department': Sequelize.STRING,
    'headcount': Sequelize.INTEGER,
    'sick': Sequelize.INTEGER,
    'vac': Sequelize.INTEGER,
    'budget': Sequelize.INTEGER
  })
}