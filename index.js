let notes=[{
    "id":1,
    "name":"Primo Cincko"
},
{
    "id":2,
    "name":"Maximiliano Cincko"
},
{
    "id":3,
    "name":"Lucian Cincko"
}]

const express = require('express');
const app=express();
const mongoose = require('mongoose');
const { authorModel, bookModel } = require('./models');
const { authorSchema } = require('./schemas');
app.use(express.json());

const user="primo5";
const password="kRknyprta5Z6JFWM"
const dbname="pruebas"
const uri=`mongodb+srv://${user}:${password}@cluster0.swplhlx.mongodb.net/${dbname}?retryWrites=true&w=majority`

mongoose.connect(uri,{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{console.log('base de datos conectada')}).catch((e)=>console.log('Error al conectar a la base de datos',e))

app.get('/',(request,response)=>{
    response.send('<h1>Hello howrl</h1>')
})

app.get('/notes',(request,response)=>{
    response.json(notes)
})

app.get('/authors',async(req,res)=>{
    try{
        const authors=await authorModel.aggregate([
            {
                $lookup:{
                    from:"books",
                    localField: "_id",
                    foreignField: "author",
                    as: "books"
                }
            }
        ]);return res.json({ authors });
    }catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
});

app.post('/authors', async (req, res) => {
    try {
      const name = req.body?.name;
      const age = req.body?.age;
  
      if (!name || !age) {
        return res.status(400).json({ message: 'Bad request, name or age not found' });
      }
      const author = new authorModel({
        name,
        age
      });
  
      const save = await author.save();
      return res.status(201).json({ author: save });
    } catch (error) {
      console.log('Error', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.get('/books', async (req, res) => {
    try {
      const books = await bookModel.find({});
      return res.json({ books });
    } catch (error) {
      console.log('Error', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.post('/books', async (req, res) => {
    try {
      const isbn = req.body?.isbn;
      const name = req.body?.name;
      const cantPages = req.body?.cantPages;
      const author = req.body?.author;
  
      if (!name || !cantPages || !author || !isbn) {
        return res.status(400).json({ message: 'Bad request, isbn or name or cantPages or author not found' });
      }
      const book = new bookModel({
        isbn,
        name,
        cantPages,
        author
      });
  
      const save = await book.save();
      return res.status(201).json({ book: save });
    } catch (error) {
      console.log('Error', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
/*const http =require('http')

const app=http.createServer((request, response)=>{
    response.writeHead(200,{'Content-Type':'application/json'})
    response.end(JSON.stringify(notes))
})
*/
const PORT=3002;
app.listen(PORT)
console.log(`Server running on port ${PORT}`)