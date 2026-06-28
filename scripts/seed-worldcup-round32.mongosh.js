// Ejecutar en mongosh contra la base del backend del Mundial.
// Ajusta el nombre de la coleccion si tu modelo usa otro.
const collectionName = 'worldcupmatches';

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

const now = new Date();

const result = db.getCollection(collectionName).bulkWrite(
  matches.map((match) => ({
    updateOne: {
      filter: { id: match.id },
      update: {
        $set: {
          ...match,
          group: null,
          result: null,
          locked: false,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      upsert: true,
    },
  }))
);

printjson(result);
