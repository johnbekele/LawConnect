const mongoose = require('mongoose');


// mongoose.connect("mongodb+srv://swayamsam2005:sLDNreRmb5R0KjQH@cluster0.ipxl289.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
require("../db"); // Import the connection file

const clientSchema= mongoose.Schema({
     user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "user", 
            required: true // Ensures each case is associated with a user
        },  
  client_name: {
    type: String,
    required: true, // Ensures the client name is mandatory
    trim: true,     // Removes extra spaces
},
phone: {
    type: Number,
    required: true,
    validate: {
        validator: (value) => /^\d{10}$/.test(value), // Ensures the phone number is 10 digits
        message: "Phone number must be 10 digits",
    },
},
case_ref_no: {
    type: Number,
    required: true,
    unique: true, // Ensures each case_ref_no is unique
},
});
module.exports= mongoose.model('client', clientSchema);
