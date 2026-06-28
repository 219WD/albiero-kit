import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Falta MONGO_URI.');
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const collection = client.db(process.env.MONGO_DB || 'test').collection('worldcupresults');
  const result = await collection.deleteMany({ id: /^r32-/ });
  console.log(JSON.stringify({ deleted: result.deletedCount }, null, 2));
} finally {
  await client.close();
}
