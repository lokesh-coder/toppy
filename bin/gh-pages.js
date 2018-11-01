const ghpages = require('gh-pages');
ghpages.publish(
  './dist/toppy-app',
  {
    repo: 'https://' + process.env.GH_TOKEN + '@github.com/lokesh-coder/toppy.git'
  },
  function(err) {
    if (err) {
      console.log('Error occured during gh pages push', err);
    } else {
      console.log('Pushed to ghpages!');
    }
  }
);
