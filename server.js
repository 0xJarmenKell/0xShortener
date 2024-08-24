const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const ShortUrl = require('./models/shortUrl');


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log(`connected to the DataBase Successfully`);
}).catch((err)=>{
    console.log(err.message);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});  

  

app.get('/', async(req, res) => {
   const shortUrls = await ShortUrl.find();
   res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async(req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect('/');
});


app.get('/:shortUrl', async(req, res) => {
 const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

 if (shortUrl == null) return res.sendStatus(404)

shortUrl.clicks++

shortUrl.save()

res.redirect(shortUrl.full)
});


