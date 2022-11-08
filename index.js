const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
//midlewares
app.use(cors());
app.use(express());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nbna82s.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){
    try{
        const servicesCollection = client.db('healthyMind').collection('services');
    }
    finally{

    }
}
run().catch(err=> console.log(err))


app.get('/', (req, res)=>{
    res.send('Healthy Mind Server is running');
});
app.listen(port, ()=> {
    console.log(`Healthy Min server is running on port ${port}`);
})