const mongoose = require('mongoose');

const uri = "mongodb://localhost:27017/mydatabase"; 
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});


const User = mongoose.model('User', userSchema);

const newUser = new User({
    name: "Naina Mahajan",
    email: "naina@example.com",
    age: 23
});

newUser.save()
    .then(user => {
        console.log('User saved:', user);
        mongoose.connection.close(); 
    })
    .catch(err => console.error('Error saving user:', err));
