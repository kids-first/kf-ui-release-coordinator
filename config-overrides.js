const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);  // change importing css to less
  config = rewireLess.withLoaderOptions({
    modifyVars: { 
      "@primary-color": "#90278e",
      "@info-color": "#2b388f",
      "@success-color": "#009bb8",
      "@error-color": "#e83a9c",
      "@highlight-color": "#fadfe1",
      "@warning-color": "#009bb8",
      "@layout-header-background": "#343434"
    },
  })(config, env);
  return config;
};
