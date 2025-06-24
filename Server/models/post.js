const mongoose = require('mongoose');

// mongoose.connect("mongodb+srv://swayamsam2005:sLDNreRmb5R0KjQH@cluster0.ipxl289.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
require("../db"); // Import the connection file
const postSchema= mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId,
 ref: "user"
},
 date: {
    type: Date,
    default: Date.now
}, 
content: String,
likes: [
    {
        type: mongoose.Schema.Types.ObjectId, ref:"user"
    }
]

});
module.exports= mongoose.model('post', postSchema);