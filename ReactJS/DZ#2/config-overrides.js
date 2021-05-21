const path = require("path");

module.exports = (config) => {
  Object.assign(config.resolve.alias, {
    components: path.join(__dirname, "/src/components/"),
    pages: path.join(__dirname, "/src/pages/"),
    services: path.join(__dirname, "/src/services/"),
  });

  return config;
};
