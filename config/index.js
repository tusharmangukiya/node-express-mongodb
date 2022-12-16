module.exports = {
  dbUri : process.env.DB_URI,
  swageerOptions: {
    swaggerOptions: {
      defaultModelsExpandDepth: 0,
    },
  },
  bcrypt: {
    salt: process.env.SALT,
  },
  secretKeys: {
    jwt: process.env.JWT
  },
}