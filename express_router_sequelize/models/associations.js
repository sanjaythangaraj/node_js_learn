function assoc(sequelize) {
  const { User, Post } = sequelize.models;



  User.hasMany(Post, {
    foreignKey: "userId",
    as: "posts",
  });

  Post.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });
}

module.exports = {
  assoc
};
