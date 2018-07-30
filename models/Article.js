const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    _id:{
        type:Number
    },
    created_at:{
        type:Date
    },
    author:{
        type:String,
        required:true
    },
    story_title:{
        type:String
    },
    title:{
        type:String
    },
    story_url:{
        type:String
    },
    url:{
        type:String
    }
});

module.exports = Article = mongoose.model('article', ArticleSchema);