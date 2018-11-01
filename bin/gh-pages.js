const ghpages = require('gh-pages');
const fs = require('fs-extra');
const version = process.argv[2];
const archiveMetaFile = './docs/assets/archived-versions.json';

async function copyFiles() {
  try {
    await fs.copy('./dist/toppy-app', `./dist/${version}`);
    await fs.copy(`./dist/${version}`, `./dist/toppy-app/${version}`);
    let archivedData = await fs.readJson(archiveMetaFile);
    archivedData = archivedData || {};
    archivedData[version] = Date.now();
    await fs.writeJson(archiveMetaFile, archivedData);
    console.log('successfully archived!');
  } catch (err) {
    console.error(err);
  }
}

copyFiles();

ghpages.publish(
  './dist/toppy-app',
  {
    repo: 'https://' + process.env.GH_TOKEN + '@github.com/lokesh-coder/toppy.git',
    silent: true,
    add: true
  },
  function(err) {
    console.error('Error occured during gh pages push', err);
  }
);
