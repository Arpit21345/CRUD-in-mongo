const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const User = require('./mongo'); 
const app = express();

const port = 4000;
app.use(express.urlencoded());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        await User.create(newUser);
        console.log(newUser);

        // Send the JSON response
        // const userDataJSON = JSON.stringify({
        //     userData: newUser
        // });
        // res.status(200).send(userDataJSON);
        
       
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during registration');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/login.html'));
});
app.post('/login', async (req, res) => {
    try {
     
      const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
      });
      if (user) {
        
        res.redirect('/home');
      } else {
        
        res.redirect('/login');
      }
    } catch (error) {
     
      console.error(error);
      res.status(500).send('Error during login');
    }
  });
  app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/home.html'));
   
});
app.post('/logout', (req, res) => {
 
  // res.redirect('/login');
});
app.get('/changepassword', (req, res) => {
  res.sendFile(path.join(__dirname, '/changepassword.html'));
});

app.post('/changepassword', async (req, res) => {
  try {
      const user = await User.findOne({
          email: req.body.email,
          password: req.body.password,
      });

      if (user) {
          
          user.password = req.body.newPassword;
          await user.save();

          res.redirect('/login'); 
      } else {
          res.status(401).send('Invalid email or password'); 
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error during password change');
  }
});
app.get('/delete', (req, res) => {
  res.sendFile(path.join(__dirname, '/delete.html'));
});
app.post('/delete', async (req, res) => {
  try {
      const user = await User.findOne({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
      });

      if (user) {
          await User.deleteOne({ _id: user._id });
          res.redirect('/'); 
      } else {
          res.redirect('/delete'); 
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error during account deletion');
  }
});


app.listen(port, () => {
    console.log(`Server on port: http://localhost:${port}`);
});
