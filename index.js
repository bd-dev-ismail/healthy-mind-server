const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
//midlewares
app.use(cors());
app.use(express());

app.get('/', (req, res)=>{
    res.send('Healthy Mind Server is running');
});
app.listen(port, ()=> {
    console.log(`Healthy Min server is running on port ${port}`);
})