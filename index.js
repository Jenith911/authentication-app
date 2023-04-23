const express = require('express');
const session = require('express-session');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey:  process.env.secretAccessKey,
    region: 'ap-south-1'
  });
const s3 = new AWS.S3();

const app = express();
const port = 3000;

// Set up session middleware
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
  }));

  app.get('/', (req, res) => {
    res.send('Welcome to the website!');
  });
  
  app.get('/members-only', (req, res) => {
    if (!req.session.loggedIn) {
      return res.redirect('/login');
    }
    res.send(`
    <html>
      <body>
        <h1>Members Only</h1>
        <form method="post" enctype="multipart/form-data" action="/upload">
          <input type="file" name="photo">
          <button type="submit">Upload</button>
        </form>
      </body>
    </html>
  `);
});

app.get('/login', (req, res) => {
    res.send(`
      <html>
        <body>
          <h1>Login</h1>
          <form method="post" action="/login">
            <input type="text" name="username" placeholder="Username">
            <input type="password" name="password" placeholder="Password">
            <button type="submit">Login</button>
          </form>
        </body>
      </html>
    `);
  });

  app.post('/login', (req, res) => {
    // Check username and password against database
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === 'admin' && password === 'password') {
      req.session.loggedIn = true;
      res.redirect('/members-only');
    } else {
      res.send('Incorrect username or password');
    }
  });
  
// configure multer middleware
const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'YOUR_S3_BUCKET_NAME',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, file.originalname);
      },
    }),
  });
  
  // endpoint to handle image upload
  app.post('/upload', upload.single('image'), (req, res) => {
    res.send('Image uploaded successfully');
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });  