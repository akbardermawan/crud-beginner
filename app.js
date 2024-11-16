const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const {body, validationResult, check, Result} = require('express-validator');
const methodOverride = require('method-override');

const Contact = require('./model/contact');

const app = express();
const port = 3000;

//setaup method override
app.use(methodOverride('_method'));

//gunakan ejs setup view engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

//build-in middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));


//konfigurasi flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: {maxAge:6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());


app.listen(port,()=>{
    console.log(`Mongo Contact App | listening at http://localhost:${port}`);
})

//halaman Home
app.get('/', (req, res) => {
    
    const mahasiswa = [
      {
        nama: "Akbar",
        email: "akbar@gmail.com"
      },
      {
        nama: "Dermawan",
        email: "dermawan@gmail.com"
      },
      {
        nama: "Mahbubillah",
        email: "mahbubillah@gmail.com"
      },
  
    ];
    
      res.render('about',{layout: "partials/main-layout", title: "Home", mahasiswa:mahasiswa});
       
  
  });

//hlaman about
  app.get('/about', (req, res) => {
    // res.sendFile('./index.html', {root:__dirname});
  
    res.render('index', {layout: "partials/main-layout", title: "About", nama: "Akbar Dermawan" });
  });

// Handle GET request for '/contact'
app.get('/contact', async(req, res) => {
  const contact = await Contact.find();
  res.render('contact', {layout: "partials/main-layout",
   title: "Contact",
   contact:contact,
  msg: req.flash('msg')});
}); 


//halaman form tambah data
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    layout: "partials/main-layout",
    title: "Tambah Data"
  });
});



//taabahkan data
app.post('/contact/submit', [
    // Validasi untuk field 'nama'
    body('nama').custom(async (value) => {
      const duplikat = await Contact.findOne({nama:value});
      if (duplikat) {
        throw new Error('Nama contact sudah digunakan');
      }
      return true;
    }),
    // Validasi untuk field 'email'
    check('email', 'Email tidak valid').isEmail(),
    // Validasi untuk field 'nohp'
    check('nohp', 'Nomor HP tidak valid').isMobilePhone('id-ID')
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('add-contact', {
        title: 'Form Tambah Data Contact', 
        layout: 'partials/main-layout',
        errors: errors.array() // Seharusnya 'errors', bukan 'erorrs'
      });
    } else {
      Contact.insertMany(req.body)
      .then((contacts) => {
        // Set pesan flash dan kembali ke halaman contact
        req.flash('msg', 'Data contact berhasil ditambahkan!');
        return res.redirect('/contact');
      })
      .catch((error) => {
        console.error('Error:', error.message);
        return res.status(500).send('Internal Server Error');
      });
    }
});

//tampilkan halaman edit data
app.get('/contact/edit/:nama', async (req, res) =>{
  const contact = await Contact.findOne({nama:req.params.nama});

 if(!contact){
   res.status(404);
   res.send('<h1> Data tidak ditemukan </h1>');
 } else{
   return res.render('edit-contact', {
    layout: "partials/main-layout",
    title: "Edit Data",
    contact: contact
  });
 }
});

//update data
app.put('/contact', [
  // Validasi untuk field 'nama'
  body('nama').custom(async (value, {req}) => {
    const duplikat = await Contact.findOne({nama:value});
    if (value !== req.body.oldNama && duplikat) {
      throw new Error('Nama contact sudah digunakan');
    }
    return true;
  }),
  // Validasi untuk field 'email'
  check('email', 'Email tidak valid').isEmail(),
  // Validasi untuk field 'nohp'
  check('nohp', 'Nomor HP tidak valid').isMobilePhone('id-ID')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('edit-contact', {
      title: 'Form Edit Data Contact', 
      layout: 'partials/main-layout',
      errors: errors.array() // Seharusnya 'errors', bukan 'erorrs'
    });
  } else {
      Contact.updateOne({ _id: req.body._id }, {
        $set: {
            nama: req.body.nama,
            nohp: req.body.nohp,
            email: req.body.email
        }
    })
    .then((result) => {
        req.flash('msg', 'Data contact berhasil diubah!');
        return res.redirect('/contact');
    })
    .catch((error) => {
        console.error('Error:', error.message);
        return res.status(500).send('Internal Server Error');
    });
  
  }
  
});



// delet contact

app.delete('/contact',(req,res)=>{
  Contact.deleteOne({nama: req.body.nama}).then((result)=>{
    req.flash('msg', 'Data contact berhasil dihapus!');
    return res.redirect('/contact');
  });
  
})




//detail data
app.get('/contact/:nama', async (req, res) => {
 
  const contact = await Contact.findOne({nama:req.params.nama});

  res.render('detail', {layout: "partials/main-layout",
   title: "detail",
   contact:contact});
});