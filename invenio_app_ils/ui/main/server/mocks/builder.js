var fs = require('fs');
var path = require('path');
var jsonFile = require('jsonfile');

var mockFolder = path.dirname(__filename);
var dataFolder = path.join(mockFolder, 'data');

fs.readdir(dataFolder, function(err, files) {
  if (err) {
    console.error('Could not list the directory.', err);
    process.exit(1);
  }
  var booksJson = [];
  files.forEach(function(file, index) {
    let rawdata = fs.readFileSync(path.join(dataFolder, file));
    let json = JSON.parse(rawdata);
    booksJson.push(json);
  });
  jsonFile.writeFile(path.join(mockFolder, 'database.json'), booksJson);
});
