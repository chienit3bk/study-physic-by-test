module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
    },
    name: {
      
    }
  })

  // Users.associate = function (models) {
  //   Users.hasMany(models.Roles, {
  //     foreignKey: ''
  //   })
  // }
  return Users;
}
