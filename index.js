const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 5001;
const app = express()
// MongoDb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware
var cors = require('cors')
app.use(cors())
app.use(express.json());
// 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mncda8.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Db location
        await client.connect();
        const serviceCollection = client.db('Car').collection('services');

        // 
        app.get('/services', async (req, res) => {
            const query = {};
            const cursore = serviceCollection.find(query);
            const result = await cursore.toArray();
            res.send(result);
        });
        // Single Item find
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });
        // Add service
        app.post('/services', async(req, res)=> {
            const addNewService = req.body;
            const result = await serviceCollection.insertOne(addNewService);
            res.send(result);
        })
        


    }
    finally {

        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Car Backendx')
})

app.listen(port, () => {
    console.log('Backend running', port)
})
