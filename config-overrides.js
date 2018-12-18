const {injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
  config = injectBabelPlugin(
    ['import', {libraryName: 'antd', style: true}],
    config,
  ); // change importing css to less
  config = rewireLess.withLoaderOptions({
    modifyVars: {
      '@primary-color': '#cc3399', //"#90278e",
      '@info-color': '#2b388f',
      '@success-color': '#009bb8',
      '@error-color': '#e83a9c',
      '@highlight-color': '#fadfe1',
      '@warning-color': '#009bb8',
      '@layout-header-background': '#343434',
      '@layout-header-background': '#2b388f',
    },
  })(config, env);

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
