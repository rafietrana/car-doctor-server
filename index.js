const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

// MIDDLEWARE

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hv89ofo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const servicesCollection = client.db("carDB").collection("services");
    const bookingCollection = client.db('carDB').collection('booking');





    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        // Include only the `title` and `imdb` fields in each returned document
        projection: { title: 1, price: 1, service_id: 1, img: 1 },
      };

      const result = await servicesCollection.findOne(query, options);
      res.send(result);
    });





  
    // booking



    app.get('/booking', async(req, res)=>{
          console.log(req.query.email);

          let querys = {};
            


          if(req.query?.email){
                  querys =  {email : req.query.email}
          }
      const result = await bookingCollection.find(querys).toArray();
      res.send(result)
 
    })


    app.post('/booking', async(req, res)=>{
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking)
      res.send(result)
        
    })


    app.patch('/booking/:id', async(req, res)=>{
      console.log('alhamdulillah this is hitting now');
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const updateBooking = req.body;
 
      console.log(updateBooking);




      const updatedDoc = {
        $set: {
          status : updateBooking.status
        }
      };
      const  result = await  bookingCollection.updateOne(filter, updatedDoc);
      res.send(result)
    })

    app.delete('/booking/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = {_id : new ObjectId(id)};
            const result = await bookingCollection.deleteOne(filter);
            res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("your browser is now runnig sucessfully alhamudlillah");
});

app.listen(port, () => {
  console.log(`Your Surver is now running port on ${port}`);
});
