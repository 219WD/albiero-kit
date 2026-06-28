import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('Falta MONGO_URI.');
  process.exit(1);
}

const client = new MongoClient(uri);

function redactDoc(doc) {
  if (!doc) return null;
  return Object.fromEntries(
    Object.keys(doc)
      .filter((key) => !/password|hash|token|secret/i.test(key))
      .map((key) => [key, doc[key]])
  );
}

try {
  await client.connect();
  const admin = client.db().admin();
  const { databases } = await admin.listDatabases({ nameOnly: true, authorizedDatabases: true });

  for (const { name } of databases) {
    if (['admin', 'local', 'config'].includes(name)) continue;
    const db = client.db(name);
    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    console.log(`DB ${name}`);
    for (const { name: collectionName } of collections) {
      const collection = db.collection(collectionName);
      const count = await collection.estimatedDocumentCount().catch(() => '?');
      const m001 = await collection.findOne({ id: 'm001' }).catch(() => null);
      const r32 = await collection.findOne({ id: /^r32-/ }).catch(() => null);
      const sample = await collection.findOne({}, { projection: { email: 0, passwordHash: 0, password: 0 } }).catch(() => null);
      console.log(JSON.stringify({
        collection: collectionName,
        count,
        hasM001: Boolean(m001),
        hasR32: Boolean(r32),
        sample: redactDoc(sample),
      }, null, 2));
    }
  }
} finally {
  await client.close();
}
