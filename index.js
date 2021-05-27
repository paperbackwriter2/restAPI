const express = require('express');
const app = express();
const posts = require('./posts.json'); // array of posts
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded());

app.get('/', function(req,res){
    res.send('these will be posts!')
})

// GET route that fetches all posts
app.get('/posts', (req,res)=>{
    return res.json(posts)
})

// POST to create a new post
app.post('/posts', (req,res)=>{
    console.log(req.body.newPost)
    // create a new post from client's request
    // save new post to existing database
    posts.push(req.body.newPost);
    // save updated data to post.json
    let stringedData = JSON.stringify(posts, null, 2);
    fs.writeFile('posts.json', stringedData, function(err) {
        if (err) {
            return res.status(500).json({ message: err})
        }
    })
    // send back a response to client
    return res.status(200).json({message: "new user created"})
})

//GET to fetch a single post
app.get('/posts/:id', (req,res)=>{
    // fetch req.params.id
    let id = req.params.id;
    // find post with id
    let foundPost = posts.find(post => {
        return String(post.id) === id
    })

    if (foundPost) {
        return res.status(200).json({post : foundPost})
}   else {
        return res.status(404).json({ message: "post not found"})
}
})

// PUT to update a single post
app.put('/posts/:id', (req,res) =>{
    // find specified post by id
    let id = req.params.id;

    let foundPost = posts.find(post => {
        return String(post.id) === id

        // foundPost will either be an object or undefined
    })
    foundPost.title = req.body.title
    foundPost.body = req.body.body

    let stringedData = JSON.stringify(posts, null, 2);
    fs.writeFile('posts.json', stringedData, function(err) {
        if (err) {
            return res.status(500).json({ message: err})
        }
    })
    return res.status(200).json({message: "post updated successfully"})
})


app.listen(3000, function(){
    console.log('server is running successfully');
})


