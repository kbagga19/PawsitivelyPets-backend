const express = require("express");
const app = express();
const cors = require('cors');
const stripe = require("stripe")('sk_test_51MUCJqSJ5OsYGHjp2fAng56vaIW9yN1aPTS2KejTC1SHrNNEjkBrfQg1ALAExattOTjANVmFOZaKYOj75sbRK9lu00PqeXqfoS');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Pet = require('./models/Pet');
const Products = require('./models/Prod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
var store = require('store');

const uploadMiddleware = multer({dest: 'uploads/'});

app.use(express.static("public"));
app.use(cors({credentials: true, origin: ["https://www.pawsitively-pets.co", "http://localhost:3000", "https://pawsitivelypets.onrender.com", "https://pawsitively-pets-frontend.vercel.app"], exposedHeaders: ["set-cookie", "cookie", "Set-Cookie, Cookie"]}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://baggakaran19:7D9H1oOFDy7wJih3@pawsitivelypets.sirru9c.mongodb.net/test');

const salt = bcrypt.genSaltSync(10);
const secret = 'hjbsd7iueiuca8';

const calculateOrderAmount = (items) => {
  const final = parseInt(items.price);
  return final * 100;
};

app.post("/create-payment-intent", async (req, res) => {
  const items = req.body; 

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.post("/register", async (req, res) => {
  const {name, email, password} = req.body;
  try {
    const userDoc = await User.create({
      name, 
      email, 
      password:bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch(e) {
    res.status(400).json(e);
  }
   
});

app.post("/login", async (req, res) => {
  const {email, password} = req.body;
  const userDoc = await User.findOne({email});
  const name = userDoc.name;
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    const token = jwt.sign({name, email, id:userDoc._id}, secret, (err, token) => {
      if (err) throw err;
      res.json({status: "ok", data: token});
    })
  } else {
    res.status(400).json("Wrong Credentials!");
  }
});

app.post("/profile", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, secret);
    const useremail = user.email;
    User.findOne({email: useremail})
    .then((data) => {
      res.send({status: "ok", data: data});
    })
    .catch((error) => {res.send({status: "error", data: error});
  });
} catch (error) {}
});

app.get("/food", async (req,res) => {
  try{
    const items = await Products.find({"type":"food"});
    res.json(items);
} catch (error) {
  console.log(error);  
}
});

app.get("/grooming", async (req,res) => {
  try{
    const items = await Products.find({"type":"grooming"});
    res.json(items);
} catch (error) {
  console.log(error);  
}
});

app.get("/accessories", async (req,res) => {
  try{
    const items = await Products.find({"type":"accessories"});
    res.json(items);
} catch (error) {
  console.log(error);  
}
});

app.post("/post", uploadMiddleware.single('file'), async (req, res) => {
  const {originalname, path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const token = req.headers['token'];
  jwt.verify(token, secret, {}, async(err,info)=>{
    if(err) throw err;
    const {title, summary, content} = req.body;
    const postDoc = await Post.create({
    title,
    summary,
    content,
    cover: newPath,
    author: info.id,
  })
    res.json(postDoc);
  });
});

app.get('/post', async(req, res) => {
  res.json(await Post.find()
      .populate('author', ['name'])
      .sort({createdAt : -1})
      // .limit(20)
    );
})

app.get('/homePost', async(req, res) => {
  res.json(await Post.find()
      .populate('author', ['name'])
      .sort({createdAt : -1})
      .limit(3)
    );
})

app.get('/post/:id', async(req,res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['name']);
  res.json(postDoc);
})

app.post('/addPet', async (req, res) => {
  const {name, gender, age} = req.body;
  try {
    const petDoc = await Pet.create({
      name,
      gender,
      age
    });
    res.json(petDoc);
  } catch(e) {
    res.status(400).json(e);
  }
})

app.listen(3001, () => console.log("Node server listening on port 3001!"));

