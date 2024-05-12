const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware//
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.texsw4y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();



        const restaurantCollection = client.db('restaurantdb').collection('restaurant')


        app.post('/restaurant', async (req, res) => {
            const addFood = req.body;
            console.log(addFood);
            const result = await restaurantCollection.insertOne(addFood);
            res.send(result);

        })
        app.get('/restaurant', async (req, res) => {
            const cursor = restaurantCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.patch('/restaurant/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedFood = req.body;
            const food = {
                $set: {
                    foodName:updatedFood.foodName,
                    quantity:updatedFood.quantity ,
                    borrowedFoods:updatedFood.borrowedFoods,
                    shortDescription:updatedFood.shortDescription,
                    price:updatedFood.price,
                    foodCategory:updatedFood.foodCategory,
                    buyerName:updatedFood.buyerName,
                    Image:updatedFood.Image,
                    isSold: true,
                    buyersEmail:updatedFood.buyersEmail 
                }
            }
            const result = await restaurantCollection.updateOne(filter, food)
            res.send(result)

        })
















        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);









app.get('/', (req, res) => {
    res.send('Restaurant  server is running ')
})

app.listen(port, () => {
    console.log(`Restaurant server is running on port:${port}`)
})
