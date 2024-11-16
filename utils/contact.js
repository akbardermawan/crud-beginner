const fs = require('fs');


const dirPath = './data';
if(!fs.existsSync(dirPath)){
fs.mkdirSync(dirPath);
}

const dataPath = './data/contacts.json';
if(!fs.existsSync(dataPath)){
  fs.writeFileSync(dataPath, '[]', 'utf-8');
}

//ambil semua data di jason
const loadCotact = ()=>{
    const file = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(file);
    return contacts;
};


  //cari contakberdasarkan nama
const findCotact = (nama) =>{
    const contacts = loadCotact();

 const contact = contacts.find((contact)=> contact.nama.toLowerCase() === nama.toLowerCase());
 return contact;
};
//menimpa data json dengan data baru
const saveContacts = (contacts)=>{
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
};

//menambahkan data contatc baru
const addContact = (contact)=>{
const contacts = loadCotact();
contacts.push(contact);
saveContacts(contacts);
};

//nama duplikat

const cekDuplikat = (nama) => {
  const contacts = loadCotact(); // Perbaiki penulisan 'loadContact'
  return contacts.find((contact) => contact.nama === nama) !== undefined; // Ubah logika pembanding
};

//delete data
const deleteContact = (nama)=>{
const contacts = loadCotact();
const filteredContact = contacts.filter((contact)=> contact.nama !== nama);

saveContacts(filteredContact);
}


//update contacts
const updateContacts = (contactBaru)=>{
  const contacts = loadCotact();
  //hilangkan contact lama yang namanya sama dengan oldnama
  const filteredContact = contacts.filter((contact)=>contact.nama !== contactBaru.oldNama);
  
  delete contactBaru.oldNama;
  
  filteredContact.push(contactBaru);
  saveContacts(filteredContact);

}

module.exports = {loadCotact, findCotact, addContact, cekDuplikat, deleteContact, updateContacts };