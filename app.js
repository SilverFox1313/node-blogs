const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const app = express();

const dbURI = 'mongodb+srv://silverfox:test123@cluster0.mm3wnrh.mongodb.net/nodetuts?retryWrites=true&w=majority&appName=Cluster0';

// connect to the db
mongoose.connect(dbURI)
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// public and styles
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
      .then(result => {
        res.render('home', { title: 'All blogs', blogs: result });
      })
      .catch (err => {
        console.log(err);
      })
});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
     .then (result => {
        res.redirect('/blogs');
     })
     .catch (err => {
        console.log(err);
     })
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
     .then (result => {
      res.render('details', { blog: result, title: 'Blog Details'});
     })
     .catch(err => {
      console.log(err);
     })
});

app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
