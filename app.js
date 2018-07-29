const express = require('express');
const path = require('path');
const request = require('request');

//Initialize app
const app = express();

//Define listening port
const PORT = 3000;

app.set('views',path.join(__dirname,'components'));
app.set('view engine','pug');

//Base app route 
app.get('/',function(req,res){
    res.render('index');
})

//Start server
app.listen(PORT,function(){
    console.log('app running on port '+PORT);
})

//Request cycle
var requestUrl = 'http://hn.algolia.com/api/v1/search_by_date?query=nodejs';
const requestInterval = 3000;

setInterval(function(){ 
    request(requestUrl,function(error,response,body){
        if(error){
            console.log('request failed');
        } else {
            try {
                let hits = JSON.parse(body).hits;
                
                //insert hits into mongodb database, use story_id as database id
                console.log(hits.length);
            } catch (err){
                console.log('non JSON object response');
            }
        }
    })
}, requestInterval);