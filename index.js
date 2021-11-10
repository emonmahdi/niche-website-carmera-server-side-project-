const express = require('express')
const app = express();
require('dotenv').config()
const cors = require('cors');
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tlqgi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);


async function run(){ 

    try{
        await client.connect(); 
        console.log('database connection successfully')
    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello Camera Collection')
})

app.listen(port, () => {
  console.log(`listening at:${port}`)
})