const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
//midlewares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nbna82s.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){
    try{
        const servicesCollection = client.db('healthyMind').collection('services');
        const reviewCollection = client.db("healthyMind").collection('review');
        //create services
        app.post('/services', async(req, res)=> {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        });
        //get services
        app.get('/services', async(req, res)=> {
            const query = {};
            const cursor = servicesCollection.find(query);
            const size = parseInt(req.query.size);
            if(size === 3){
                const services = await cursor.limit(size).toArray();
                return res.send(services);
            }
            else{
                const services = await cursor.toArray();
                res.send(services);
            }
        })
        //get one data
        app.get('/services/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.findOne(query);
            res.send(result);
        });
        //create review
        app.post('/reviews', async(req, res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        });
        //get all review
        app.get('/reviews',async(req, res)=>{
            const id = req.query.id;
            
            const query = {serviceId : id};
            const cursor = reviewCollection.find(query).sort({ _id: 1 });
            const result = await cursor.toArray();
            res.send(result);
        });
        
    }
    finally{

    }
}
run().catch(err=> console.log(err.message))


app.get('/', (req, res)=>{
    res.send('Healthy Mind Server is running');
});
app.listen(port, ()=> {
    console.log(`Healthy Min server is running on port ${port}`);
})