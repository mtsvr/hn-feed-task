const express = require('express');
const path = require('path');
const request = require('request');
const mongoose = require('mongoose');

const articles = require('./routes/articles');

//Connect to database
mongoose
    .connect('mongodb://localhost:27017/hnfeed',{ useNewUrlParser: true })
    .then(()=> console.log('connected to MongoDB'))
    .catch((err)=>console.log(err))

const Article = require('./models/Article');

//Initialize app
const app = express();

//Define listening port
const PORT = 3000;

app.set('views',path.join(__dirname,'components'));
app.set('view engine','pug');

app.use('/articles',articles);

//Base app route 
app.get('/',function(req,res){
    Article.find()
        .sort({created_at: -1})
        .then(items => {
            res.render('index',{
                data:items
            });        
        })
    // res.render('index',{
    //     data:['hola','diego','vera']
    // });
})

app.get('/dbtest',function(req,res){
    Article.find()
        .sort({created_at: -1})
        .then(items => {
            res.json(items);        
        })
    // res.render('index',{
    //     data:['hola','diego','vera']
    // });
})
//Start server
app.listen(PORT,function(){
    console.log('app running on port '+PORT);
})

//Request cycle
var requestUrl = 'http://hn.algolia.com/api/v1/search_by_date?query=nodejs';
const requestInterval = 10000;

setInterval(function(){ 
    request(requestUrl,function(error,response,body){
        if(error){
            console.log('request failed');
        } else {
            try {
                let hits = JSON.parse(body).hits;
                //insert hits into mongodb database, use story_id as database id
                hits.forEach(h => {
                    let art = new Article({
                        _id:h.objectID,
                        created_at:new Date(h.created_at),
                        author:h.author,
                        story_title:h.story_title,
                        title:h.title,
                        story_url:h.story_url,
                        url:h.url
                    });

                    art
                        .save()
                        .then(()=>{console.log('inserted document',h.objectID)})
                        .catch(err => {
                            if(err.code!=11000) 
                                console.log(err)
                        });
                });     
            } catch (err){
                console.log('non JSON object response');
            }
        }
    })
}, requestInterval);