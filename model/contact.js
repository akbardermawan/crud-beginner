const mongoose = require('mongoose');

// Definisi skema
const contactSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    nohp: {
        type: String,
        required: true
    },
    email: String
});

// Koneksi ke MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/akbar')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => console.error('Connection error:', err));

// Membuat model dari skema
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
