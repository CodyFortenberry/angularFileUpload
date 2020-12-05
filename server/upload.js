const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
var qs = require('querystring');

module.exports = function upload(req, res) {
  const form = new IncomingForm();
  var readStream = null;
  var body = '';

  req.on('data', function (data) {
      body += data;
  });

  req.on('end', function () {
      var post = qs.parse(body);
      console.log(post.id);
  });


  form.on('file', (field, file) => {
    readStream = fs.createReadStream(file.path);
  });

  form.on('end', () => {
    res.json();
  });


  form.parse(req);
};
