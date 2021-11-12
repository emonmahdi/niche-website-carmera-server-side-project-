const express = require('express')
const app = express();
require('dotenv').config()
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tlqgi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);


async function run(){ 

    try{
        await client.connect(); 
        const database = client.db('cameraDb');
        const productsCollection = database.collection('products'); 
        const usersCollection = database.collection('users');
        const orderCollection = database.collection('orders')


        // get products api homepage products
        app.get('/products',  async(req, res) => {
            const cursor  = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })
 

        // post resgiter user data
        app.post('/users', async(req, res) => {
          const user = req.body; 
          const result = await usersCollection.insertOne(user)
          console.log(result);
          res.json(result);
        });
        // upser email filter one time register on users
        app.put('/users', async(req, res) => {
          const user = req.body;
          const filter = {email: user.email};
          const options = { upsert: true };
          const updateDoc = {$set:user};
          const result = await usersCollection.updateOne(filter, updateDoc, options);
          res.json(result)
        })  
          // user role admin check GET API
        app.get('/users/:email', async(req, res) => {
          const email = req.params.email;
          const query = { email: email };
          const user = await usersCollection.findOne(query);
          let isAdmin = false;
          if(user?.role === 'admin'){
              isAdmin= true;
          }
          res.json({admin: isAdmin})
        })


         // Order book post api
        app.post('/myorder', async(req, res) => {
          const order = req.body;
          console.log('hitting the order', order);
          const result = await orderCollection.insertOne(order);
          console.log(result);
          res.json(result);
        });
 
        //my order GET API
        app.get('/order/:email', async(req, res) => {
          console.log(req.params.email)
          const query = {email: req.params.email};
          console.log(query) 
          const result = await orderCollection.find({email:  req?.params?.email}).toArray();
          console.log('get the api service', result);
           res.json(result);
        });

        // my orders DELETE API
        app.delete('/order/:id', async (req, res) => {
          const id = req.params.id;
          console.log(id)
          const query = { _id: ObjectId(id) };
          const result = await orderCollection.deleteOne(query);
          console.log('deleting user with id', id);
          res.json(result);
        });
        // manage all order get api
        app.get('/orders', async(req, res) => {
          const cursor = orderCollection.find({})
          const result = await cursor.toArray();
          res.send(result);  
          console.log('all orders here',result)
        }) ;
        // manage all order DELETE API
        app.delete('/orders/:id', async (req, res) => {
          const id = req.params.id;
          console.log(id)
          const query = { _id: ObjectId(id) };
          const result = await orderCollection.deleteOne(query);
          console.log('deleting user with id', id);
          res.json(result);
        });
        // make admin set role PUT API
        app.put('/users/admin', async(req, res) => {
          const user = req.body;
          console.log('put' , user);
          const filter = {email: user.email};
          const updateDoc = {$set: { role: 'admin' }};
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.json(result);
        })

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