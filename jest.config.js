module.exports = {
  transform: {
    '^.+\\.hbs$': 'handlebars-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
};
