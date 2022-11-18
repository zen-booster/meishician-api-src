const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const DB_NAME = 'meishicianDB';

const dbPath = process.env.DB_PATH.replace(
  '<password>',
  process.env.PASSWORD
).replace('<db>', DB_NAME);

mongoose.connect(
  dbPath,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  },
  () => console.log('Mongoose is connected for users collection')
);
