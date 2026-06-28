import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const forcedDb = process.env.MONGO_DB || '';
const forcedCollection = process.env.MONGO_COLLECTION || '';

if (!uri) {
  console.error('Falta MONGO_URI en variables de entorno.');
  process.exit(1);
}

const matches = [
  { id: 'r32-001', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'RSA', away: 'CAN', kickoff: '2026-06-28T16:00:00-03:00' },
  { id: 'r32-002', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'BRA', away: 'JPN', kickoff: '2026-06-29T14:00:00-03:00' },
  { id: 'r32-003', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'GER', away: 'PAR', kickoff: '2026-06-29T17:30:00-03:00' },
  { id: 'r32-004', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'NED', away: 'MAR', kickoff: '2026-06-29T22:00:00-03:00' },
  { id: 'r32-005', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'CIV', away: 'NOR', kickoff: '2026-06-30T14:00:00-03:00' },
  { id: 'r32-006', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'FRA', away: 'SWE', kickoff: '2026-06-30T18:00:00-03:00' },
  { id: 'r32-007', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'MEX', away: 'ECU', kickoff: '2026-06-30T22:00:00-03:00' },
  { id: 'r32-008', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'ENG', away: 'COD', kickoff: '2026-07-01T13:00:00-03:00' },
  { id: 'r32-009', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'BEL', away: 'SEN', kickoff: '2026-07-01T17:00:00-03:00' },
  { id: 'r32-010', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'USA', away: 'BIH', kickoff: '2026-07-01T21:00:00-03:00' },
  { id: 'r32-011', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'ESP', away: 'AUT', kickoff: '2026-07-02T16:00:00-03:00' },
  { id: 'r32-012', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'POR', away: 'CRO', kickoff: '2026-07-02T20:00:00-03:00' },
  { id: 'r32-013', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'SUI', away: 'ALG', kickoff: '2026-07-03T00:00:00-03:00' },
  { id: 'r32-014', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'AUS', away: 'EGY', kickoff: '2026-07-03T15:00:00-03:00' },
  { id: 'r32-015', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'ARG', away: 'CPV', kickoff: '2026-07-03T19:00:00-03:00' },
  { id: 'r32-016', stage: 'Eliminatoria de 32', round: 'round-of-32', home: 'COL', away: 'GHA', kickoff: '2026-07-03T22:30:00-03:00' },
];

async function listDatabaseNames(client) {
  if (forcedDb) return [forcedDb];
  const admin = client.db().admin();
  const result = await admin.listDatabases({ nameOnly: true, authorizedDatabases: true });
  return result.databases
    .map((database) => database.name)
    .filter((name) => !['admin', 'local', 'config'].includes(name));
}

async function scoreCollection(db, collectionName) {
  const collection = db.collection(collectionName);
  const fixtureSample = await collection.findOne({ id: 'm001' }, { projection: { id: 1, home: 1, away: 1, kickoff: 1, stage: 1 } });
  const groupSample = await collection.findOne({ stage: 'Grupos', home: { $exists: true }, away: { $exists: true } }, { projection: { id: 1 } });
  let score = 0;
  if (/world.?cup|mundial|fixture|match|partido/i.test(collectionName)) score += 4;
  if (fixtureSample?.id) score += 20;
  if (groupSample?.id) score += 8;
  return { collectionName, score, fixtureSample, groupSample };
}

async function findTarget(client) {
  if (forcedDb && forcedCollection) {
    return { dbName: forcedDb, collectionName: forcedCollection };
  }

  const candidates = [];
  const databaseNames = await listDatabaseNames(client);

  for (const dbName of databaseNames) {
    const db = client.db(dbName);
    const collections = forcedCollection
      ? [{ name: forcedCollection }]
      : await db.listCollections({}, { nameOnly: true }).toArray();

    for (const collectionInfo of collections) {
      try {
        const scored = await scoreCollection(db, collectionInfo.name);
        if (scored.score > 0) {
          candidates.push({ dbName, ...scored });
        }
      } catch {
        // Ignore collections where the user cannot read or score.
      }
    }
  }

  candidates.sort((left, right) => right.score - left.score);
  if (!candidates[0]) {
    throw new Error('No pude detectar la coleccion de partidos. Setea MONGO_DB y MONGO_COLLECTION.');
  }

  return candidates[0];
}

async function main() {
  const client = new MongoClient(uri);
  await client.connect();

  try {
    const target = await findTarget(client);
    const collection = client.db(target.dbName).collection(target.collectionName);
    const now = new Date();

    const result = await collection.bulkWrite(matches.map((match) => ({
      updateOne: {
        filter: { id: match.id },
        update: {
          $set: {
            ...match,
            group: null,
            venue: 'Sede por confirmar',
            locked: false,
            updatedAt: now,
          },
          $setOnInsert: {
            result: null,
            createdAt: now,
          },
        },
        upsert: true,
      },
    })));

    const stored = await collection.countDocuments({ id: { $in: matches.map((match) => match.id) } });
    console.log(JSON.stringify({
      db: target.dbName,
      collection: target.collectionName,
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount,
      storedRoundOf32: stored,
    }, null, 2));
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
