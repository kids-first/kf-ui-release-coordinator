module.exports = function override(config, env) {
  require('react-app-rewire-postcss')(config, {
    plugins: loader => [
      require('autoprefixer')(),
      require('postcss-import')(),
      require('postcss-nested')(),
      require('postcss-inherit')(),
    ],
  });

  return config;
};
