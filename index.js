const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'Unauthorized Access!'});
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'Forbidded Access!'})
        }
        req.decoded = decoded;
        next();
    })
}

async function run(){
    try{
        const servicesCollection = client.db('healthyMind').collection('services');
        const reviewCollection = client.db("healthyMind").collection('review');
        //jwt Note: after 30days it will be expaired !
        app.post('/jwt', (req, res)=>{
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30d'});
            res.send({token})
        })
        //create services
        app.post('/services', verifyJWT, async(req, res)=> {
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
                const services = await await cursor
                  .limit(size)
                  .sort({ _id: -1 })
                  .toArray();
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
        app.post('/reviews', verifyJWT, async(req, res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        });
        //get all review by  query
        app.get('/reviews',async(req, res)=>{
            const id = req.query.id;
            const query = {serviceId : id};
            const cursor = reviewCollection.find(query).sort({ _id: -1 });
            const result = await cursor.toArray();
            res.send(result);
        });
        //get review by id
        app.get('/review/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await reviewCollection.findOne(query);
            res.send(result)
        })
        //get review by email
        app.get("/myreview",verifyJWT, async (req, res) => {
            const decoded = req.decoded;
            if(decoded.email !== req.query.email){
                res.status(403).send({message: 'Forbidden Access!'})
            }
          const email = req.query.email;
          const query = { email: email };
          const cursor = reviewCollection.find(query).sort({ _id: -1 });
          const result = await cursor.toArray();
          res.send(result);
        });
        //review delte by id
        app.delete('/myreview/:id', verifyJWT, async(req, res)=>{
            
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });
        //update review by put
        app.put("/myreviewupdate/:id", verifyJWT, async (req, res) => {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) };
          const getReview = req.body;
          const updateReview = {
            $set: {
              review: getReview.review,
            },
          };
          const options = { upsert: true };
          const result = await reviewCollection.updateOne(
            filter,
            updateReview,
            options
          );
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