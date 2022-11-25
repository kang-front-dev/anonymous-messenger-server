const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
dotenv.config();

const client = new MongoClient(
  'mongodb+srv://admin:admin@cluster0.vcewazx.mongodb.net/?retryWrites=true&w=majority'
);

const startMongo = async () => {
  try {
    await client.connect();

    console.log('Database connected!');
  } catch (error) {
    console.log(error);
  }
};
startMongo();
const users = client.db().collection('users');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.patch('/login', async (request, response)=>{
  console.log(request.body);
  const query = {name: request.body.name}
  const isUserExist = await users.findOne(query)
  if(isUserExist){
    return response.status(200).json({success: true, message: 'Welcome back!'})
  }else{
    const user = await users.insertOne(query)
    if (user.acknowledged) {
      return response.status(200).json({success: true, message: 'Welcome!'})
    }
  }
})

app.listen(process.env.PORT, () => {
  console.log('app is running');
});