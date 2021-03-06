const express = require('express');
const fs = require('fs');
//const upload = require('./upload');
let multer  = require('multer');
let upload  = multer({ storage: multer.memoryStorage() });

const server = express();
const cors = require('cors');
const uploadBase = "./fileUploads/";

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

server.use(cors(corsOptions));

server.post('/upload', upload.single('file'), (req, res) => {
  let file = req.file;
  let userId = req.body.userId;
  let id = req.body.id;
  //let path = req.body.path;
  let isFolder = req.body.isFolder === "true";
  let userDirectory = uploadBase + userId;
  let uploadPath = userDirectory + "/" + id;
  
  if (!fs.existsSync(userDirectory)) {
    fs.mkdir(userDirectory, (err) => {
      if (err) {throw err;}
      res.send(saveFile(isFolder,file,uploadPath));
    });
  }
  else {
    res.send(saveFile(isFolder,file,uploadPath));
  }
});

function saveFile(isFolder,file,uploadPath) {
  if (isFolder) {
    fs.mkdir(uploadPath, (err) => {
      if (err) {throw err;}
      return ('created directory');
    });
  }
  else {
    fs.writeFile(uploadPath, file.buffer, (err) => {
      if (err) {throw err;}
      return ('saved file');
    });
  }
}

server.get('/download/:id',(req,res)=>{  
  let fileId = req.params.id;
  let userId = req.query.userId;
  let name = req.query.name;
  let ext = req.query.ext;
  let path = uploadBase + userId + "/" + fileId;
  res.download(path,name + "." + ext); 
})  



server.listen(3000, () => {
  console.log('Server started!');
});
