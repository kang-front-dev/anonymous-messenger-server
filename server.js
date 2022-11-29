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

app.get('/getAll', async (request, response) => {
  const usersData = await users.find().toArray();
  if (usersData) {
    return response.status(200).json({ success: true, data: usersData });
  } else {
    return response
      .status(404)
      .json({ success: false, message: 'Unknown error' });
  }
});
app.patch('/getUserData', async (request, response) => {
  const query = { name: request.body.name };
  const userDataResult = await users.findOne(query);
  if (userDataResult) {
    return response.status(200).json({ success: true, userData: userDataResult });
  } else {
    return response
      .status(404)
      .json({ success: false, message: 'User does not exist' });
  }
});

app.patch('/login', async (request, response) => {
  const query = { name: request.body.name};
  const userData = await users.findOne(query);
  if (userData) {
    return response.status(200).json({
      success: true,
      message: 'Welcome back!',
      avatarColor: userData.avatarColor,
    });
  } else {
    const queryReg = { ...query, avatarColor: request.body.avatarColor, chats: [] };
    const user = await users.insertOne(queryReg);
    if (user.acknowledged) {
      return response.status(200).json({
        success: true,
        message: 'Welcome!',
        avatarColor: request.body.avatarColor,
      });
    }
  }
});
app.patch('/updateUser', async (request, response) => {
  const query = { name: request.body.name };
  const queryUpdate = {
    $set: {
      chats: request.body.chats
    },
  };
  const updateResponse = await users.findOneAndUpdate(query, queryUpdate);

  if (updateResponse.ok) {
    return response
      .status(200)
      .json({ success: true, message: 'Successfully updated.' });
  } else {
    return response.status(404).json({
      success: true,
      message: 'Something is wrong.',
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log('app is running');
});
