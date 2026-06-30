import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import { ADMIN_TOKEN_KEY, getAdminFromToken } from '../../utils/adminSession';
import { WORLDCUP_TOKEN_KEY, getWorldCupUserFromToken } from '../../utils/worldCupSession';
import albieroLogo from '../../assets/logo.png';
import sygnusA1Image from '../../assets/CygnusA1.png';
import {
  WORLD_CUP_FIXTURE as FALLBACK_WORLD_CUP_FIXTURE,
  WORLD_CUP_GROUPS as FALLBACK_WORLD_CUP_GROUPS,
  WORLD_CUP_PRIZES as FALLBACK_WORLD_CUP_PRIZES,
  WORLD_CUP_TEAMS as FALLBACK_WORLD_CUP_TEAMS,
} from './worldCupFixtureFallback';
import './WorldCup.css';

const PROD_API_BASE = 'https://albi-backend-nine.vercel.app';
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || '';
const API_BASE =
  import.meta.env.DEV && isLocalHost
    ? 'http://localhost:4000'
    : !isLocalHost && configuredApiBase.includes('localhost')
    ? PROD_API_BASE
    : configuredApiBase || (isLocalHost ? 'http://localhost:4000' : PROD_API_BASE);

const SCORE_OPTIONS = Array.from({ length: 21 }, (_, index) => index);
const CAMERA_INFO = 'Camara interior A1 de 2 MP con audio bidireccional en tiempo real, vision nocturna HD, deteccion de movimiento, seguimiento automatico, deteccion de audio y deteccion de cuerpo humano. Su giro e inclinacion cubren 360 grados para ver interiores en vivo desde Cygnus Mobile Viewer. Incluye vision nocturna IR, vigilancia 24 horas y multiples metodos de deteccion.';
const ROUND_OF_32_STAGE = 'Eliminatoria de 32';

const FLAG_CODES = {
  ALG: 'dz',
  ARG: 'ar',
  AUS: 'au',
  AUT: 'at',
  BEL: 'be',
  BIH: 'ba',
  BRA: 'br',
  CAN: 'ca',
  CIV: 'ci',
  COL: 'co',
  COD: 'cd',
  CPV: 'cv',
  CRO: 'hr',
  CUW: 'cw',
  CZE: 'cz',
  ECU: 'ec',
  EGY: 'eg',
  ENG: 'gb-eng',
  ESP: 'es',
  FRA: 'fr',
  GER: 'de',
  GHA: 'gh',
  HAI: 'ht',
  IRQ: 'iq',
  IRN: 'ir',
  JOR: 'jo',
  JPN: 'jp',
  KOR: 'kr',
  KSA: 'sa',
  MAR: 'ma',
  MEX: 'mx',
  MEX2: 'mx',
  NED: 'nl',
  NOR: 'no',
  NZL: 'nz',
  PAN: 'pa',
  PAR: 'py',
  POL: 'pl',
  POR: 'pt',
  QAT: 'qa',
  RSA: 'za',
  SAU: 'sa',
  SCO: 'gb-sct',
  SEN: 'sn',
  SUI: 'ch',
  SWE: 'se',
  TUN: 'tn',
  TUR: 'tr',
  URU: 'uy',
  USA: 'us',
  UZB: 'uz',
};

const teamPayload = (code) => FALLBACK_WORLD_CUP_TEAMS[code] || { code, name: code, flag: '' };

const ROUND_OF_32_MATCHES = [
  { id: 'r32-001', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'RSA', away: 'CAN', kickoff: '2026-06-28T16:00:00-03:00' },
  { id: 'r32-002', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'BRA', away: 'JPN', kickoff: '2026-06-29T14:00:00-03:00' },
  { id: 'r32-003', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'GER', away: 'PAR', kickoff: '2026-06-29T17:30:00-03:00' },
  { id: 'r32-004', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'NED', away: 'MAR', kickoff: '2026-06-29T22:00:00-03:00' },
  { id: 'r32-005', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'CIV', away: 'NOR', kickoff: '2026-06-30T14:00:00-03:00' },
  { id: 'r32-006', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'FRA', away: 'SWE', kickoff: '2026-06-30T18:00:00-03:00' },
  { id: 'r32-007', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'MEX', away: 'ECU', kickoff: '2026-06-30T22:00:00-03:00' },
  { id: 'r32-008', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'ENG', away: 'COD', kickoff: '2026-07-01T13:00:00-03:00' },
  { id: 'r32-009', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'BEL', away: 'SEN', kickoff: '2026-07-01T17:00:00-03:00' },
  { id: 'r32-010', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'USA', away: 'BIH', kickoff: '2026-07-01T21:00:00-03:00' },
  { id: 'r32-011', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'ESP', away: 'AUT', kickoff: '2026-07-02T16:00:00-03:00' },
  { id: 'r32-012', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'POR', away: 'CRO', kickoff: '2026-07-02T20:00:00-03:00' },
  { id: 'r32-013', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'SUI', away: 'ALG', kickoff: '2026-07-03T00:00:00-03:00' },
  { id: 'r32-014', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'AUS', away: 'EGY', kickoff: '2026-07-03T15:00:00-03:00' },
  { id: 'r32-015', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'ARG', away: 'CPV', kickoff: '2026-07-03T19:00:00-03:00' },
  { id: 'r32-016', stage: ROUND_OF_32_STAGE, round: 'round-of-32', home: 'COL', away: 'GHA', kickoff: '2026-07-03T22:30:00-03:00' },
];

function hydrateWorldCupMatch(match) {
  return {
    ...match,
    homeTeam: match.homeTeam || teamPayload(match.home),
    awayTeam: match.awayTeam || teamPayload(match.away),
    result: match.result || null,
    locked: Boolean(match.locked) || new Date(match.kickoff).getTime() <= Date.now(),
  };
}

function isRoundOf32Match(match) {
  return match.stage === ROUND_OF_32_STAGE || match.round === 'round-of-32';
}

function withRoundOf32Matches(fixtureData = {}) {
  const currentMatches = (fixtureData.matches || []).map(hydrateWorldCupMatch);
  const existingKeys = new Set(currentMatches.map((match) => `${match.home}-${match.away}-${match.kickoff}`));
  const existingIds = new Set(currentMatches.map((match) => match.id));
  const roundOf32 = ROUND_OF_32_MATCHES
    .filter((match) => !existingIds.has(match.id) && !existingKeys.has(`${match.home}-${match.away}-${match.kickoff}`))
    .map(hydrateWorldCupMatch);

  return {
    ...fixtureData,
    groups: fixtureData.groups || FALLBACK_WORLD_CUP_GROUPS,
    prizes: fixtureData.prizes || FALLBACK_WORLD_CUP_PRIZES,
    matches: [...roundOf32, ...currentMatches],
  };
}

function isBackendMissingMatchError(err) {
  return err?.status === 404 || String(err?.message || '').toLowerCase().includes('partido invalido');
}

const LOCAL_FIXTURE_FALLBACK = {
  groups: FALLBACK_WORLD_CUP_GROUPS,
  prizes: FALLBACK_WORLD_CUP_PRIZES,
  matches: [...ROUND_OF_32_MATCHES, ...FALLBACK_WORLD_CUP_FIXTURE].map(hydrateWorldCupMatch),
};

async function apiRequest(endpoint, options = {}, token = '') {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || `Error ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

function formatKickoff(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha a confirmar';
  return date.toLocaleString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatGroupLabel(match) {
  const labels = {
    ARG: 'Grupo Argentina',
    ELITE: 'Partidos destacados',
    HOSTS: 'Anfitriones y candidatos',
  };
  const group = labels[match.group] || (match.group ? `Grupo ${match.group}` : match.stage);
  const isArgentinaGroupMatch = Boolean(match.group) && (match.home === 'ARG' || match.away === 'ARG');

  return isArgentinaGroupMatch ? `${group} / ARG` : group;
}

function hasScoreValue(value) {
  return value !== '' && value !== undefined && value !== null;
}

function isDrawScore(homeScore, awayScore) {
  return hasScoreValue(homeScore) && hasScoreValue(awayScore) && Number(homeScore) === Number(awayScore);
}

function formatResultScore(result) {
  if (!result) return '';
  const baseScore = `${result.homeScore} - ${result.awayScore}`;
  if (hasScoreValue(result.homePenaltyScore) && hasScoreValue(result.awayPenaltyScore)) {
    return `${baseScore} (${result.homePenaltyScore} - ${result.awayPenaltyScore})`;
  }
  return baseScore;
}

function getMatchWinnerTeam(match) {
  if (!match?.result) return null;
  const homeScore = Number(match.result.homeScore);
  const awayScore = Number(match.result.awayScore);
  if (homeScore > awayScore) return match.homeTeam;
  if (awayScore > homeScore) return match.awayTeam;

  if (hasScoreValue(match.result.homePenaltyScore) && hasScoreValue(match.result.awayPenaltyScore)) {
    return Number(match.result.homePenaltyScore) > Number(match.result.awayPenaltyScore) ? match.homeTeam : match.awayTeam;
  }

  return null;
}

function buildNextRound(matches, stage) {
  const nextMatches = [];
  for (let index = 0; index < matches.length; index += 2) {
    const left = matches[index];
    const right = matches[index + 1];
    nextMatches.push({
      id: `${stage}-${index / 2}`,
      stage,
      homeTeam: left ? getMatchWinnerTeam(left) : null,
      awayTeam: right ? getMatchWinnerTeam(right) : null,
      sourceMatches: [left, right].filter(Boolean),
    });
  }
  return nextMatches;
}

function buildKnockoutBracket(matches = []) {
  const roundOf32 = matches
    .filter(isRoundOf32Match)
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  const roundOf16 = buildNextRound(roundOf32, 'Octavos');
  const quarterFinals = buildNextRound(roundOf16, 'Cuartos');
  const semifinals = buildNextRound(quarterFinals, 'Semifinales');
  const final = buildNextRound(semifinals, 'Final');

  return [
    { key: 'r32', title: ROUND_OF_32_STAGE, matches: roundOf32 },
    { key: 'r16', title: 'Octavos', matches: roundOf16 },
    { key: 'qf', title: 'Cuartos', matches: quarterFinals },
    { key: 'sf', title: 'Semifinales', matches: semifinals },
    { key: 'final', title: 'Final', matches: final },
  ];
}

function ScoreControl({ value, onChange, disabled, onFocus, label }) {
  const normalizedValue = value === '' || value === undefined || value === null ? null : Number(value);
  const canDecrease = normalizedValue !== null && normalizedValue > 0;
  const canIncrease = normalizedValue === null || normalizedValue < SCORE_OPTIONS[SCORE_OPTIONS.length - 1];

  const updateScore = (nextValue) => {
    if (disabled) return;
    if (onFocus) onFocus();
    onChange(nextValue);
  };

  return (
    <div
      className={`wc-score-control ${normalizedValue === null ? 'is-empty' : ''}`}
      aria-label={label}
      role="group"
      onMouseDown={onFocus}
    >
      <button
        type="button"
        aria-label={`Bajar ${label}`}
        disabled={disabled || !canDecrease}
        onClick={() => updateScore(Math.max(0, normalizedValue - 1))}
      >
        -
      </button>
      <button
        type="button"
        className="wc-score-value"
        aria-label={`Elegir ${label}`}
        disabled={disabled}
        onClick={() => updateScore(normalizedValue === null ? 0 : normalizedValue)}
      >
        {normalizedValue === null ? '-' : normalizedValue}
      </button>
      <button
        type="button"
        aria-label={`Subir ${label}`}
        disabled={disabled || !canIncrease}
        onClick={() => updateScore(normalizedValue === null ? 0 : normalizedValue + 1)}
      >
        +
      </button>
    </div>
  );
}

function PredictionSelect({ value, onChange, disabled, onFocus, label }) {
  return (
    <ScoreControl
      value={value}
      onChange={onChange}
      disabled={disabled}
      onFocus={onFocus}
      label={label}
    />
  );
}

function getFlagUrl(team) {
  const flagCode = FLAG_CODES[team?.code] || team?.code?.toLowerCase();
  return flagCode ? `https://flagcdn.com/${flagCode}.svg` : '';
}

function getFlagFallback(team) {
  const flagCode = FLAG_CODES[team?.code] || team?.code?.toLowerCase();
  if (/^[a-z]{2}$/.test(flagCode || '')) {
    return flagCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
  }

  const specialFlags = {
    ENG: 'ENG',
    SCO: 'SCO',
  };

  return specialFlags[team?.code] || team?.flag || team?.code || '';
}

function Team({ team, align = 'left' }) {
  const flagUrl = getFlagUrl(team);
  const flagFallback = getFlagFallback(team);

  return (
    <span className={`wc-team wc-team--${align}`}>
      <b className="wc-team-flag">
        {flagUrl ? (
          <img
            src={flagUrl}
            alt={`Bandera de ${team.name}`}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.remove();
            }}
          />
        ) : null}
        <span>{flagFallback}</span>
      </b>
      <em>{team.name}</em>
    </span>
  );
}

function TeamInline({ team }) {
  const flagUrl = getFlagUrl(team);
  const flagFallback = getFlagFallback(team);

  return (
    <span className="wc-team-inline">
      {flagUrl ? (
        <img
          src={flagUrl}
          alt={`Bandera de ${team.name}`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.remove();
          }}
        />
      ) : null}
      <span className="wc-team-inline__flag">{flagFallback}</span>
      <b>{team.name}</b>
    </span>
  );
}

function normalizeGroups(groups = [], matches = []) {
  if (groups.length && typeof groups[0] === 'object') {
    return groups.map((group) => ({
      ...group,
      sourceId: group.sourceId || group.id,
    }));
  }

  const ids = [...new Set(matches.map((match) => match.group).filter(Boolean))].sort();
  return ids.map((id) => ({
    id: String(id).replace('Grupo ', ''),
    sourceId: id,
    name: String(id).startsWith('Grupo ') ? String(id) : `Grupo ${id}`,
    teams: [...new Set(matches.filter((match) => match.group === id).flatMap((match) => [match.home, match.away]))],
  }));
}

function isGroupMatch(match, group) {
  return match.group === group.id || match.group === group.sourceId;
}

function buildGroupTables(groups, matches) {
  return groups.map((group) => {
    const rows = new Map();

    group.teams.forEach((teamCode) => {
      const sampleMatch = matches.find((match) => match.home === teamCode || match.away === teamCode);
      const team = sampleMatch?.home === teamCode ? sampleMatch.homeTeam : sampleMatch?.awayTeam;
      rows.set(teamCode, {
        team: team || { code: teamCode, name: teamCode },
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    });

    matches.filter((match) => isGroupMatch(match, group) && match.result).forEach((match) => {
      const home = rows.get(match.home);
      const away = rows.get(match.away);
      if (!home || !away) return;

      const homeScore = Number(match.result.homeScore);
      const awayScore = Number(match.result.awayScore);
      home.played += 1;
      away.played += 1;
      home.goalsFor += homeScore;
      home.goalsAgainst += awayScore;
      away.goalsFor += awayScore;
      away.goalsAgainst += homeScore;

      if (homeScore > awayScore) {
        home.won += 1;
        away.lost += 1;
        home.points += 3;
      } else if (awayScore > homeScore) {
        away.won += 1;
        home.lost += 1;
        away.points += 3;
      } else {
        home.drawn += 1;
        away.drawn += 1;
        home.points += 1;
        away.points += 1;
      }
    });

    const standings = [...rows.values()]
      .map((row) => ({
        ...row,
        goalDifference: row.goalsFor - row.goalsAgainst,
      }))
      .sort((a, b) => (
        b.points - a.points
        || b.goalDifference - a.goalDifference
        || b.goalsFor - a.goalsFor
        || a.team.name.localeCompare(b.team.name, 'es')
      ));

    return { ...group, standings };
  });
}

export default function WorldCup() {
  const [token, setToken] = useState(() => localStorage.getItem(WORLDCUP_TOKEN_KEY) || '');
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '');
  const userFromToken = useMemo(() => getWorldCupUserFromToken(token), [token]);
  const adminFromToken = useMemo(() => getAdminFromToken(adminToken), [adminToken]);
  const [mode, setMode] = useState('login');
  const [tab, setTab] = useState('fixture');
  const [fixture, setFixture] = useState({ matches: [], prizes: [], groups: [] });
  const [predictions, setPredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [drafts, setDrafts] = useState({});
  const [resultDrafts, setResultDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [savingResultId, setSavingResultId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [groupStageOpen, setGroupStageOpen] = useState(false);
  const [topbarScrolled, setTopbarScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [adminPredictionAudit, setAdminPredictionAudit] = useState({ rows: [], byMatch: [], users: [], total: 0, summary: {} });
  const [adminPredictionMatch, setAdminPredictionMatch] = useState('all');
  const [adminPredictionUser, setAdminPredictionUser] = useState('all');
  const [adminPredictionResultStatus, setAdminPredictionResultStatus] = useState('all');
  const [adminPredictionScoreCode, setAdminPredictionScoreCode] = useState('all');
  const [loadingAdminPredictions, setLoadingAdminPredictions] = useState(false);

  const predictionMap = useMemo(() => new Map(predictions.map((prediction) => [prediction.matchId, prediction])), [predictions]);
  const groupOptions = useMemo(() => normalizeGroups(fixture.groups, fixture.matches), [fixture]);
  const groupTables = useMemo(() => buildGroupTables(groupOptions, fixture.matches), [groupOptions, fixture.matches]);
  const teamOptions = useMemo(() => {
    const teams = new Map();
    fixture.matches.forEach((match) => {
      teams.set(match.home, match.homeTeam);
      teams.set(match.away, match.awayTeam);
    });
    return [...teams.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }, [fixture.matches]);
  const filteredMatches = useMemo(() => fixture.matches.filter((match) => {
    const activeGroup = groupOptions.find((group) => group.id === selectedGroup);
    const groupMatch = selectedGroup === 'all' || (!isRoundOf32Match(match) && (activeGroup ? isGroupMatch(match, activeGroup) : match.group === selectedGroup));
    const teamMatch = selectedTeam === 'all' || match.home === selectedTeam || match.away === selectedTeam;
    return groupMatch && teamMatch;
  }), [fixture.matches, groupOptions, selectedGroup, selectedTeam]);
  const roundOf32Matches = useMemo(() => filteredMatches
    .filter((match) => isRoundOf32Match(match) && selectedGroup === 'all')
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()), [filteredMatches, selectedGroup]);
  const groupStageMatches = useMemo(() => filteredMatches
    .filter((match) => !isRoundOf32Match(match))
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()), [filteredMatches]);
  const knockoutBracket = useMemo(() => buildKnockoutBracket(fixture.matches), [fixture.matches]);
  const shouldShowGroupStage = groupStageOpen || selectedGroup !== 'all' || selectedTeam !== 'all';
  const selectedTeamSchedule = useMemo(() => {
    if (selectedTeam === 'all') return [];
    return fixture.matches.filter((match) => match.home === selectedTeam || match.away === selectedTeam);
  }, [fixture.matches, selectedTeam]);
  const savedPredictionMatches = useMemo(() => predictions
    .map((prediction) => {
      const match = fixture.matches.find((fixtureMatch) => fixtureMatch.id === prediction.matchId);
      return match ? { ...match, prediction } : null;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()), [fixture.matches, predictions]);
  const missingPredictionMatches = useMemo(() => fixture.matches
    .filter((match) => !predictionMap.has(match.id))
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()), [fixture.matches, predictionMap]);
  const adminVoteRows = adminPredictionAudit.rows || [];

  const isMatchLocked = (match) => {
    const kickoffTime = new Date(match.kickoff).getTime();
    if (Number.isNaN(kickoffTime)) return Boolean(match.locked);
    return Boolean(match.locked) || kickoffTime <= currentTime;
  };

  const loadPublicData = async () => {
    try {
      const [fixtureData, leaderboardData] = await Promise.all([
        apiRequest('/api/worldcup/fixture'),
        apiRequest('/api/worldcup/leaderboard'),
      ]);
      setFixture(withRoundOf32Matches(fixtureData));
      setLeaderboard(leaderboardData.leaderboard || []);
      return true;
    } catch (err) {
      setFixture(LOCAL_FIXTURE_FALLBACK);
      setLeaderboard([]);
      return false;
    }
  };

  const loadMe = async (nextToken = token) => {
    if (!nextToken) return;
    const data = await apiRequest('/api/worldcup/me', {}, nextToken);
    setPredictions(data.predictions || []);
  };

  const loadAdminPredictionAudit = async (
    matchId = adminPredictionMatch,
    userId = adminPredictionUser,
    resultStatus = adminPredictionResultStatus,
    scoreCode = adminPredictionScoreCode,
  ) => {
    if (!adminToken || !adminFromToken) return;

    setLoadingAdminPredictions(true);
    try {
      const params = new URLSearchParams();
      if (matchId && matchId !== 'all') params.set('matchId', matchId);
      if (userId && userId !== 'all') params.set('userId', userId);
      if (resultStatus && resultStatus !== 'all') params.set('resultStatus', resultStatus);
      if (scoreCode && scoreCode !== 'all') params.set('scoreCode', scoreCode);
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await apiRequest(`/api/worldcup/admin/predictions${query}`, {}, adminToken);
      setAdminPredictionAudit({
        rows: data.rows || [],
        byMatch: data.byMatch || [],
        users: data.users || [],
        total: data.total || 0,
        summary: data.summary || {},
      });
    } catch (err) {
      if (err.status === 401) {
        expireAdminSession();
        setError('Tu sesion admin vencio o pertenece a otro backend. Inicia sesion admin de nuevo.');
        return;
      }
      setError(err.message || 'No se pudieron cargar los pronosticos.');
    } finally {
      setLoadingAdminPredictions(false);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    setError('');

    try {
      const publicDataLoaded = await loadPublicData();
      if (token && publicDataLoaded) await loadMe(token);
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem(WORLDCUP_TOKEN_KEY);
        setToken('');
      }
      setError(err.message || 'No se pudo cargar el Mundial Albiero.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const nextDrafts = {};
    predictions.forEach((prediction) => {
      nextDrafts[prediction.matchId] = {
        homeScore: prediction.homeScore,
        awayScore: prediction.awayScore,
      };
    });
    setDrafts(nextDrafts);
  }, [predictions]);

  useEffect(() => {
    if (tab === 'admin' && (!adminToken || !adminFromToken)) {
      setTab('fixture');
    }
  }, [adminFromToken, adminToken, tab]);

  useEffect(() => {
    if (tab !== 'admin' || !adminToken || !adminFromToken) return;
    loadAdminPredictionAudit(adminPredictionMatch, adminPredictionUser, adminPredictionResultStatus, adminPredictionScoreCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminFromToken, adminPredictionMatch, adminPredictionResultStatus, adminPredictionScoreCode, adminPredictionUser, adminToken, tab]);

  useEffect(() => {
    const updateTopbar = () => setTopbarScrolled(window.scrollY > 10);
    updateTopbar();
    window.addEventListener('scroll', updateTopbar, { passive: true });
    return () => window.removeEventListener('scroll', updateTopbar);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setCurrentTime(Date.now()), 15000);
    return () => window.clearInterval(interval);
  }, []);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const tryAdminLogin = async () => {
      const adminData = await apiRequest('/api/emailmkt/login', {
        method: 'POST',
        body: JSON.stringify({ username: form.email, password: form.password }),
      });
      localStorage.setItem(ADMIN_TOKEN_KEY, adminData.token);
      setAdminToken(adminData.token);
      return adminData;
    };

    try {
      const endpoint = mode === 'register' ? '/api/worldcup/register' : '/api/worldcup/login';
      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(form),
      });
      localStorage.setItem(WORLDCUP_TOKEN_KEY, data.token);
      setToken(data.token);
      setMessage(mode === 'register' ? 'Usuario creado. Bienvenido al prode.' : 'Sesion iniciada.');

      if (mode === 'login') {
        try {
          await tryAdminLogin();
        } catch {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          setAdminToken('');
        }
      }

      setTab('fixture');
    } catch (err) {
      if (mode === 'login') {
        try {
          await tryAdminLogin();
          setMessage('Sesion iniciada.');
          setTab('admin');
          return;
        } catch {
          // Keep the public login deliberately generic.
        }
      }

      setError(mode === 'register' ? (err.message || 'No se pudo crear la cuenta.') : 'Email o contrasena incorrectos.');
    }
  };

  const logout = () => {
    localStorage.removeItem(WORLDCUP_TOKEN_KEY);
    setToken('');
    setPredictions([]);
  };

  const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminToken('');
  };

  const expireAdminSession = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminToken('');
    setTab('login');
  };

  const setDraftScore = (matchId, field, value) => {
    setDrafts((current) => ({
      ...current,
      [matchId]: {
        homeScore: current[matchId]?.homeScore ?? '',
        awayScore: current[matchId]?.awayScore ?? '',
        [field]: value,
      },
    }));
  };

  const savePrediction = async (match) => {
    const existingPrediction = predictionMap.get(match.id);
    if (existingPrediction) {
      setMessage('Este pronostico ya fue guardado y no se puede editar.');
      toast('Este pronostico ya fue guardado y no se puede editar.');
      return;
    }

    if (isMatchLocked(match)) {
      setError('Este partido ya empezo y el pronostico esta cerrado.');
      toast.error('Pronostico cerrado: el partido ya empezo.');
      await loadPublicData();
      return;
    }

    if (!token) {
      setTab('login');
      setError('Inicia sesion para cargar tu pronostico.');
      return;
    }

    const draft = drafts[match.id] || {};
    if (draft.homeScore === '' || draft.awayScore === '' || draft.homeScore === undefined || draft.awayScore === undefined) {
      setError('Elegi los dos goles antes de guardar.');
      return;
    }

    setSavingId(match.id);
    setError('');
    setMessage('');

    try {
      const data = await apiRequest(`/api/worldcup/predictions/${encodeURIComponent(match.id)}`, {
        method: 'PUT',
        body: JSON.stringify(draft),
      }, token);
      setPredictions((current) => {
        const without = current.filter((prediction) => prediction.matchId !== match.id);
        return [...without, data.prediction];
      });
      setMessage('Pronostico guardado.');
      toast.success('Pronostico guardado.');
      await loadPublicData();
    } catch (err) {
      setError(isBackendMissingMatchError(err)
        ? 'Este partido ya se ve en el fixture, pero todavia no esta cargado en el backend. Hay que actualizar la API para guardar pronosticos.'
        : err.message || 'No se pudo guardar el pronostico.');
    } finally {
      setSavingId('');
    }
  };

  const setResultScore = (match, field, value) => {
    const matchId = match.id;
    setResultDrafts((current) => ({
      ...current,
      [matchId]: {
        homeScore: current[matchId]?.homeScore ?? match.result?.homeScore ?? '',
        awayScore: current[matchId]?.awayScore ?? match.result?.awayScore ?? '',
        homePenaltyScore: current[matchId]?.homePenaltyScore ?? match.result?.homePenaltyScore ?? '',
        awayPenaltyScore: current[matchId]?.awayPenaltyScore ?? match.result?.awayPenaltyScore ?? '',
        [field]: value,
        ...(field === 'homeScore' || field === 'awayScore' ? { homePenaltyScore: '', awayPenaltyScore: '' } : {}),
      },
    }));
  };

  const saveOfficialResult = async (match) => {
    if (!adminToken) {
      setTab('admin');
      setError('Inicia sesion admin para cargar resultados.');
      return;
    }

    const draft = resultDrafts[match.id] || {};
    const homeScore = draft.homeScore ?? match.result?.homeScore ?? '';
    const awayScore = draft.awayScore ?? match.result?.awayScore ?? '';
    const homePenaltyScore = draft.homePenaltyScore ?? match.result?.homePenaltyScore ?? '';
    const awayPenaltyScore = draft.awayPenaltyScore ?? match.result?.awayPenaltyScore ?? '';

    if (homeScore === '' || awayScore === '' || homeScore === undefined || awayScore === undefined) {
      setError('Carga los dos goles oficiales antes de guardar.');
      return;
    }

    const shouldSavePenalties = isDrawScore(homeScore, awayScore) && (hasScoreValue(homePenaltyScore) || hasScoreValue(awayPenaltyScore));
    if (shouldSavePenalties && (!hasScoreValue(homePenaltyScore) || !hasScoreValue(awayPenaltyScore))) {
      setError('Carga los dos penales o dejalos vacios.');
      return;
    }

    setSavingResultId(match.id);
    setError('');
    setMessage('');

    try {
      const data = await apiRequest(`/api/worldcup/matches/${encodeURIComponent(match.id)}/result`, {
        method: 'PATCH',
        body: JSON.stringify({
          homeScore,
          awayScore,
          homePenaltyScore: shouldSavePenalties ? homePenaltyScore : null,
          awayPenaltyScore: shouldSavePenalties ? awayPenaltyScore : null,
        }),
      }, adminToken);
      setFixture((current) => ({
        ...current,
        matches: current.matches.map((currentMatch) => (
          currentMatch.id === match.id ? data.match : currentMatch
        )),
      }));
      setResultDrafts((current) => {
        const next = { ...current };
        delete next[match.id];
        return next;
      });
      const leaderboardData = await apiRequest('/api/worldcup/leaderboard');
      setLeaderboard(leaderboardData.leaderboard || []);
      await loadAdminPredictionAudit(adminPredictionMatch, adminPredictionUser, adminPredictionResultStatus, adminPredictionScoreCode);
      setMessage(match.result ? 'Resultado oficial actualizado. Ranking recalculado.' : 'Resultado oficial cargado.');
    } catch (err) {
      if (err.status === 401) {
        expireAdminSession();
        setError('Tu sesion admin vencio o pertenece a otro backend. Inicia sesion admin de nuevo.');
        return;
      }
      setError(isBackendMissingMatchError(err)
        ? 'Este partido ya se ve en el fixture, pero todavia no esta cargado en el backend. Hay que actualizar la API para guardar resultados.'
        : err.message || 'No se pudo cargar el resultado.');
    } finally {
      setSavingResultId('');
    }
  };

  const goToLogin = () => {
    setTab('login');
    setMode('login');
    setMessage('');
    setError('Inicia sesion para cargar o cambiar pronosticos.');
  };

  const openParticipantBreakdown = (participant) => {
    if (!adminToken || !adminFromToken) {
      return;
    }

    setAdminPredictionUser(participant.user.id);
    setAdminPredictionMatch('all');
    setAdminPredictionResultStatus('all');
    setAdminPredictionScoreCode('all');
    setTab('admin');
    setMessage(`Mostrando desglose de ${participant.user.name}.`);
    setError('');
  };

  const renderMatchCard = (match) => {
    const prediction = predictionMap.get(match.id);
    const draft = drafts[match.id] || {};
    const isPredictionSaved = Boolean(prediction);
    const matchIsLocked = isMatchLocked(match);
    const predictionDisabled = matchIsLocked || isPredictionSaved;

    return (
      <article className={`wc-match ${match.home === 'ARG' || match.away === 'ARG' ? 'is-arg' : ''}`} key={match.id}>
        <div className="wc-match-top">
          <span>{formatGroupLabel(match)}</span>
          <small>{formatKickoff(match.kickoff)}</small>
        </div>
        <div className="wc-match-main">
          <Team team={match.homeTeam} />
          <div className="wc-score">
            {match.result ? (
              <strong>{formatResultScore(match.result)}</strong>
            ) : !token ? (
              <button type="button" className="wc-score-login" onClick={goToLogin}>
                Pronosticar
              </button>
            ) : (
              <>
                <PredictionSelect
                  label={`${match.homeTeam.name} goles`}
                  value={draft.homeScore ?? prediction?.homeScore}
                  disabled={predictionDisabled}
                  onFocus={!token ? goToLogin : undefined}
                  onChange={(value) => setDraftScore(match.id, 'homeScore', value)}
                />
                <span>:</span>
                <PredictionSelect
                  label={`${match.awayTeam.name} goles`}
                  value={draft.awayScore ?? prediction?.awayScore}
                  disabled={predictionDisabled}
                  onFocus={!token ? goToLogin : undefined}
                  onChange={(value) => setDraftScore(match.id, 'awayScore', value)}
                />
              </>
            )}
          </div>
          <Team team={match.awayTeam} align="right" />
        </div>
        <div className="wc-match-bottom">
          <span>{match.result ? 'Resultado oficial cargado.' : matchIsLocked ? 'Pronostico cerrado: el partido ya empezo.' : 'Una vez guardado ya no se puede editar la prediccion.'}</span>
          {prediction?.points !== undefined && <small>{prediction.points} pts</small>}
          {!match.result && token && (
            <button type="button" disabled={predictionDisabled || savingId === match.id} onClick={() => savePrediction(match)}>
              {isPredictionSaved ? 'Guardado' : matchIsLocked ? 'Cerrado' : savingId === match.id ? 'Guardando...' : 'Guardar'}
            </button>
          )}
          {!match.result && !token && (
            <button type="button" onClick={goToLogin}>Entrar para jugar</button>
          )}
        </div>
      </article>
    );
  };

  const renderBracketTeam = (team) => (
    <div className={`wc-bracket-team ${team ? '' : 'is-pending'}`}>
      {team ? (
        <TeamInline team={team} />
      ) : (
        <>
          <span className="wc-bracket-placeholder" aria-hidden="true" />
          <b>A definir</b>
        </>
      )}
    </div>
  );

  const renderBracketMatch = (match) => {
    const isOfficialMatch = Boolean(match.homeTeam && match.awayTeam && match.kickoff);
    const winner = isOfficialMatch ? getMatchWinnerTeam(match) : null;

    return (
      <article className={`wc-bracket-match ${match.result ? 'has-result' : ''}`} key={match.id}>
        <div className="wc-bracket-match-top">
          <span>{isOfficialMatch ? formatShortDateTime(match.kickoff) : 'A definir'}</span>
          {match.result && <small>{hasScoreValue(match.result.homePenaltyScore) ? 'Fin (P)' : 'Fin'}</small>}
        </div>
        <div className="wc-bracket-row">
          {renderBracketTeam(match.homeTeam)}
          {match.result && <strong className={winner?.code === match.homeTeam?.code ? 'is-winner' : ''}>{match.result.homeScore}</strong>}
        </div>
        <div className="wc-bracket-row">
          {renderBracketTeam(match.awayTeam)}
          {match.result && <strong className={winner?.code === match.awayTeam?.code ? 'is-winner' : ''}>{match.result.awayScore}</strong>}
        </div>
        {match.result && hasScoreValue(match.result.homePenaltyScore) && (
          <div className="wc-bracket-penalties">
            Penales {match.result.homePenaltyScore} - {match.result.awayPenaltyScore}
          </div>
        )}
      </article>
    );
  };

  const tabs = [
    { key: 'fixture', label: 'Fixture' },
    { key: 'grupos', label: 'Llaves' },
    { key: 'ranking', label: 'Ranking' },
    { key: 'premios', label: 'Premios' },
    { key: 'reglas', label: 'Como jugar' },
    ...(adminToken && adminFromToken ? [{ key: 'admin', label: 'Admin' }] : []),
    { key: 'login', label: token ? 'Mis predicciones' : 'Ingresar' },
  ];

  return (
    <main className="wc-page">
      <Toaster position="top-right" toastOptions={{ className: 'wc-toast', duration: 2600 }} />
      <section className="wc-shell">
        <nav className={`wc-topbar ${topbarScrolled ? 'is-scrolled' : ''}`} aria-label="Navegacion Mundial Albiero">
          <a className="wc-topbar__brand" href="/">
            <img src={albieroLogo} alt="Albiero Seguridad" />
          </a>
          <a className="wc-topbar__back" href="/">
            Volver atras
          </a>
        </nav>

        <header className="wc-hero">
          <div>
            <span className="wc-brand">Albiero presenta</span>
            <h1>Mundial Albiero 2026</h1>
            <p>El fixture del Mundial camino a la cuarta estrella de Argentina.</p>
          </div>
          <div className="wc-stars" aria-label="Cuarta estrella Argentina">
            {[1, 2, 3, 4].map((star) => (
              <FontAwesomeIcon icon={faStar} key={star} aria-hidden="true" />
            ))}
          </div>
        </header>

        <nav className="wc-tabs" aria-label="Secciones Mundial Albiero">
          {tabs.map((item) => (
            <button type="button" key={item.key} className={tab === item.key ? 'is-active' : ''} onClick={() => setTab(item.key)}>
              {item.label}
            </button>
          ))}
        </nav>

        {message && <div className="wc-alert wc-alert--ok">{message}</div>}
        {error && <div className="wc-alert wc-alert--error">{error}</div>}

        {loading ? (
          <section className="wc-card wc-loading">Cargando fixture...</section>
        ) : (
          <>
            {tab === 'fixture' && (
              <>
                <section className="wc-card wc-filter-bar">
                  <label>
                    Grupo
                    <select value={selectedGroup} onChange={(event) => setSelectedGroup(event.target.value)}>
                      <option value="all">Todos los grupos</option>
                      {groupOptions.map((group) => (
                        <option value={group.id} key={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Seleccion
                    <select value={selectedTeam} onChange={(event) => setSelectedTeam(event.target.value)}>
                      <option value="all">Todas las selecciones</option>
                      {teamOptions.map((team) => (
                        <option value={team.code} key={team.code}>{team.name}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="wc-link-btn"
                    onClick={() => {
                      setSelectedGroup('all');
                      setSelectedTeam('all');
                    }}
                  >
                    Limpiar filtros
                  </button>
                </section>

                {selectedTeam !== 'all' && selectedTeamSchedule.length > 0 && (
                  <section className="wc-card wc-team-schedule">
                    <div className="wc-section-head">
                      <h2>Camino de {teamOptions.find((team) => team.code === selectedTeam)?.name}</h2>
                      <p>{selectedTeamSchedule.length} partidos del fixture.</p>
                    </div>
                    <div className="wc-team-route">
                      {selectedTeamSchedule.map((match) => {
                        const rival = match.home === selectedTeam ? match.awayTeam : match.homeTeam;
                        return (
                          <div key={match.id}>
                            <span>{formatGroupLabel(match)}</span>
                            <TeamInline team={rival} />
                            <small>{formatKickoff(match.kickoff)}</small>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {selectedGroup === 'all' && (
                  <section className="wc-stage-section wc-stage-section--knockout">
                    <div className="wc-stage-title">
                      <div>
                        <span>Fase eliminatoria</span>
                        <h2>{ROUND_OF_32_STAGE}</h2>
                      </div>
                      <small>{roundOf32Matches.length} partidos</small>
                    </div>
                    <section className="wc-fixture">
                      {roundOf32Matches.map(renderMatchCard)}
                    </section>
                  </section>
                )}

                <section className="wc-stage-section wc-stage-section--groups">
                  <button
                    type="button"
                    className="wc-stage-toggle"
                    aria-expanded={shouldShowGroupStage}
                    onClick={() => setGroupStageOpen((current) => !current)}
                  >
                    <span>
                      <small>Fixture completo</small>
                      <strong>Fase de Grupos</strong>
                    </span>
                    <b>{shouldShowGroupStage ? 'Ocultar' : 'Ver partidos'}</b>
                  </button>
                  {shouldShowGroupStage && (
                    <section className="wc-fixture">
                      {groupStageMatches.map(renderMatchCard)}
                    </section>
                  )}
                </section>
              </>
            )}

            {tab === 'grupos' && (
              <>
                <section className="wc-card wc-knockout-map">
                  <div className="wc-section-head">
                    <h2>Llave eliminatoria</h2>
                    <p>Los cruces futuros se completan automaticamente cuando se cargan los resultados oficiales.</p>
                  </div>
                  <div className="wc-bracket" aria-label="Llave eliminatoria Mundial Albiero">
                    {knockoutBracket.map((round) => (
                      <div className="wc-bracket-round" key={round.key}>
                        <h3>{round.title}</h3>
                        <div className="wc-bracket-stack">
                          {round.matches.map(renderBracketMatch)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="wc-groups">
                  {groupTables.map((group) => (
                    <article className="wc-card wc-group-table" key={group.id}>
                      <div className="wc-section-head">
                        <h2>{group.name}</h2>
                        <p>{fixture.matches.filter((match) => isGroupMatch(match, group)).length} partidos programados.</p>
                      </div>
                      <div className="wc-standings">
                        <div className="wc-standings-head">
                          <span>Seleccion</span>
                          <span>PJ</span>
                          <span>DG</span>
                          <span>Pts</span>
                        </div>
                        {group.standings.map((row) => (
                          <div className={`wc-standings-row ${row.team.code === 'ARG' ? 'is-arg' : ''}`} key={row.team.code}>
                            <TeamInline team={row.team} />
                            <span>{row.played}</span>
                            <span>{row.goalDifference}</span>
                            <strong>{row.points}</strong>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </section>
              </>
            )}

            {tab === 'ranking' && (
              <section className="wc-card">
                <div className="wc-section-head">
                  <h2>Ranking general</h2>
                  <p>Exacto: 5 pts. Resultado y diferencia: 4 pts. Resultado: 3 pts. Errado: -1 pt. Como admin, toca un participante para ver su desglose.</p>
                </div>
                <div className="wc-ranking">
                  {leaderboard.length ? leaderboard.map((row) => (
                    <button
                      type="button"
                      className={`wc-rank-row wc-rank-row--${row.position}`}
                      key={row.user.id}
                      onClick={() => openParticipantBreakdown(row)}
                    >
                      <strong>#{row.position}</strong>
                      <span>{row.user.name}</span>
                      <em>{row.points} pts</em>
                      <small>
                        {row.exact} exactos / {row.fixturePredictions ?? row.predictions}/{row.totalMatches || fixture.matches.length || '?'} pronosticos
                      </small>
                    </button>
                  )) : (
                    <p className="wc-muted">Todavia no hay participantes.</p>
                  )}
                </div>
              </section>
            )}

            {tab === 'premios' && (
              <section className="wc-prizes">
                {fixture.prizes.map((prize) => (
                  <article className={`wc-prize wc-prize--${prize.place}`} key={prize.place} tabIndex={0}>
                    <div className="wc-prize__visual" aria-hidden="true">
                      <img src={sygnusA1Image} alt="" className="wc-prize__camera wc-prize__camera--main" />
                      {prize.place === 1 && (
                        <img src={sygnusA1Image} alt="" className="wc-prize__camera wc-prize__camera--second" />
                      )}
                      {prize.place === 2 && (
                        <strong className="wc-prize__discount">20% OFF</strong>
                      )}
                    </div>
                    <div className="wc-prize__content">
                      <span>#{prize.place}</span>
                      <h2>{prize.title}</h2>
                      <p>{prize.description}</p>
                    </div>
                    <div className="wc-prize__details">
                      <strong>Camara Cygnus A1</strong>
                      <p>{CAMERA_INFO}</p>
                    </div>
                  </article>
                ))}
              </section>
            )}

            {tab === 'reglas' && (
              <section className="wc-rules">
                <article className="wc-card wc-rules-hero">
                  <div>
                    <p className="wc-brand">Reglamento Mundial Albiero</p>
                    <h2>Como participar</h2>
                    <p>
                      Crea tu cuenta, elegi los resultados del fixture y suma puntos segun tus aciertos.
                      El ranking define los ganadores cuando termine la competencia.
                    </p>
                  </div>
                  <button type="button" className="wc-primary-btn" onClick={() => setTab(token ? 'fixture' : 'login')}>
                    {token ? 'Ir al fixture' : 'Crear cuenta'}
                  </button>
                </article>

                <div className="wc-rules-grid">
                  <article className="wc-card wc-rule-card">
                    <span>01</span>
                    <h3>Pronosticos</h3>
                    <p>Elegis el marcador de cada partido. Una vez guardado, no se puede editar.</p>
                  </article>
                  <article className="wc-card wc-rule-card">
                    <span>02</span>
                    <h3>Cierre por horario</h3>
                    <p>Cada partido se bloquea automaticamente cuando llega la hora de inicio.</p>
                  </article>
                  <article className="wc-card wc-rule-card">
                    <span>03</span>
                    <h3>Puntaje</h3>
                    <p>Exacto: 5 pts. Resultado y diferencia: 4 pts. Resultado correcto: 3 pts. Errado: -1 pt.</p>
                  </article>
                  <article className="wc-card wc-rule-card">
                    <span>04</span>
                    <h3>Ranking</h3>
                    <p>El ranking se actualiza cuando Albiero carga los resultados oficiales.</p>
                  </article>
                </div>

                <article className="wc-card wc-terms">
                  <div className="wc-section-head">
                    <h2>Terminos y condiciones</h2>
                    <p>Resumen simple para participar sin vueltas raras.</p>
                  </div>
                  <div className="wc-terms-list">
                    <p>Participa una persona por cuenta registrada. Albiero puede revisar usuarios duplicados o datos falsos.</p>
                    <p>Los pronosticos quedan firmes al guardarse y no se modifican manualmente despues.</p>
                    <p>Los resultados oficiales son cargados por el administrador segun el resultado final del partido.</p>
                    <p>Ante empate en puntos, se priorizan exactos, cantidad de pronosticos acertados y criterio administrativo razonable.</p>
                    <p>Los premios corresponden al primer, segundo y tercer puesto del ranking final.</p>
                    <p>Albiero puede contactar a los ganadores por email para coordinar la entrega del premio.</p>
                  </div>
                </article>
              </section>
            )}

            {tab === 'admin' && (
              <section className="wc-admin-dashboard">
                <article className="wc-card wc-admin-results">
                  <div className="wc-section-head">
                    <h2>Resultados oficiales</h2>
                    <p>Como admin podes cargar o corregir resultados oficiales. El ranking se recalcula al guardar.</p>
                  </div>

                  {!adminToken || !adminFromToken ? (
                    <div className="wc-empty-state">
                      <strong>Sesion requerida.</strong>
                      <span>Volve a ingresar para continuar.</span>
                      <button type="button" className="wc-primary-btn" onClick={() => setTab('login')}>Ingresar</button>
                    </div>
                  ) : (
                    <>
                      <div className="wc-admin-status">
                        <span>{adminFromToken.username || adminFromToken.email}</span>
                        <button type="button" className="wc-link-btn" onClick={logoutAdmin}>Salir admin</button>
                      </div>

                      <div className="wc-admin-match-list">
                        {fixture.matches.map((match) => {
                          const draft = resultDrafts[match.id] || {};
                          const homeResultValue = draft.homeScore ?? match.result?.homeScore;
                          const awayResultValue = draft.awayScore ?? match.result?.awayScore;
                          const homePenaltyValue = draft.homePenaltyScore ?? match.result?.homePenaltyScore;
                          const awayPenaltyValue = draft.awayPenaltyScore ?? match.result?.awayPenaltyScore;
                          const showPenaltyControls = isDrawScore(homeResultValue, awayResultValue);

                          return (
                            <article className={`wc-admin-match ${match.result ? 'has-result' : ''}`} key={match.id}>
                              <div>
                                <span>{formatGroupLabel(match)}</span>
                                <strong>{match.homeTeam.name} vs {match.awayTeam.name}</strong>
                                <small>{formatKickoff(match.kickoff)}</small>
                              </div>
                              <div className="wc-admin-score-stack">
                                <div className="wc-admin-score">
                                  <ScoreControl
                                    label={`${match.homeTeam.name} resultado oficial`}
                                    value={homeResultValue}
                                    onChange={(value) => setResultScore(match, 'homeScore', value)}
                                  />
                                  <span>:</span>
                                  <ScoreControl
                                    label={`${match.awayTeam.name} resultado oficial`}
                                    value={awayResultValue}
                                    onChange={(value) => setResultScore(match, 'awayScore', value)}
                                  />
                                </div>
                                {showPenaltyControls && (
                                  <div className="wc-admin-penalties">
                                    <span>Penales</span>
                                    <div className="wc-admin-score">
                                      <ScoreControl
                                        label={`${match.homeTeam.name} penales`}
                                        value={homePenaltyValue}
                                        onChange={(value) => setResultScore(match, 'homePenaltyScore', value)}
                                      />
                                      <span>:</span>
                                      <ScoreControl
                                        label={`${match.awayTeam.name} penales`}
                                        value={awayPenaltyValue}
                                        onChange={(value) => setResultScore(match, 'awayPenaltyScore', value)}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                disabled={savingResultId === match.id}
                                onClick={() => saveOfficialResult(match)}
                              >
                                {savingResultId === match.id ? 'Guardando...' : match.result ? 'Actualizar resultado' : 'Guardar resultado'}
                              </button>
                            </article>
                          );
                        })}
                      </div>
                    </>
                  )}
                </article>

                {adminToken && adminFromToken && (
                  <article className="wc-card wc-admin-audit">
                    <div className="wc-section-head">
                      <h2>Quien voto a quien</h2>
                    <p>Auditoria de pronosticos, resultados oficiales y puntos asignados.</p>
                    </div>

                    <div className="wc-admin-audit-tools">
                      <label>
                        Usuario
                        <select
                          value={adminPredictionUser}
                          onChange={(event) => setAdminPredictionUser(event.target.value)}
                        >
                          <option value="all">Todos los usuarios</option>
                          {(adminPredictionAudit.users || []).map((user) => (
                            <option value={user.id} key={user.id}>
                              {user.name || user.email} - {user.predictions} votos
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Partido
                        <select
                          value={adminPredictionMatch}
                          onChange={(event) => setAdminPredictionMatch(event.target.value)}
                        >
                          <option value="all">Todos los partidos</option>
                          {fixture.matches.map((match) => (
                            <option value={match.id} key={match.id}>
                              {formatGroupLabel(match)} - {match.homeTeam.name} vs {match.awayTeam.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Estado partido
                        <select
                          value={adminPredictionResultStatus}
                          onChange={(event) => setAdminPredictionResultStatus(event.target.value)}
                        >
                          <option value="all">Todos</option>
                          <option value="finished">Finalizados</option>
                          <option value="pending">Pendientes</option>
                        </select>
                      </label>
                      <label>
                        Puntaje
                        <select
                          value={adminPredictionScoreCode}
                          onChange={(event) => setAdminPredictionScoreCode(event.target.value)}
                        >
                          <option value="all">Todos</option>
                          <option value="exact">Resultado exacto</option>
                          <option value="difference">Ganador + diferencia</option>
                          <option value="outcome">Ganador/empate</option>
                          <option value="miss">Errados</option>
                          <option value="pending">Sin resultado oficial</option>
                        </select>
                      </label>
                      <button
                        type="button"
                        className="wc-primary-btn"
                        onClick={() => loadAdminPredictionAudit(adminPredictionMatch, adminPredictionUser, adminPredictionResultStatus, adminPredictionScoreCode)}
                        disabled={loadingAdminPredictions}
                      >
                        {loadingAdminPredictions ? 'Actualizando...' : 'Actualizar'}
                      </button>
                      <button
                        type="button"
                        className="wc-link-btn"
                        onClick={() => {
                          setAdminPredictionUser('all');
                          setAdminPredictionMatch('all');
                          setAdminPredictionResultStatus('all');
                          setAdminPredictionScoreCode('all');
                        }}
                      >
                        Limpiar
                      </button>
                    </div>

                    <div className="wc-admin-audit-stats">
                      <div>
                        <strong>{adminPredictionAudit.total || 0}</strong>
                        <span>pronosticos</span>
                      </div>
                      <div>
                        <strong>{adminPredictionAudit.byMatch?.length || 0}</strong>
                        <span>partidos con votos</span>
                      </div>
                      <div>
                        <strong>{(adminPredictionAudit.users || []).filter((user) => user.predictions > 0).length}</strong>
                        <span>usuarios con votos</span>
                      </div>
                      <div>
                        <strong>{adminPredictionAudit.summary?.points ?? 0}</strong>
                        <span>puntos del filtro</span>
                      </div>
                      <div>
                        <strong>{adminPredictionAudit.summary?.exact ?? 0}</strong>
                        <span>exactos</span>
                      </div>
                      <div>
                        <strong>{adminPredictionAudit.summary?.pending ?? 0}</strong>
                        <span>pendientes</span>
                      </div>
                    </div>

                    <div className="wc-admin-vote-list">
                      {loadingAdminPredictions ? (
                        <p className="wc-muted">Cargando pronosticos...</p>
                      ) : adminVoteRows.length ? adminVoteRows.map((row) => (
                        <article className="wc-admin-vote-row" key={row.id}>
                          <div className="wc-admin-vote-user">
                            <strong>{row.user?.name || row.user?.email || 'Sin nombre'}</strong>
                            <span>{row.user?.email || 'Sin email'}</span>
                            <small>{row.updatedAt ? `Guardado ${formatShortDateTime(row.updatedAt)}` : 'Sin fecha'}</small>
                          </div>
                          <div className="wc-admin-vote-match">
                            <span>{row.match ? `${formatGroupLabel(row.match)} - ${formatShortDateTime(row.match.kickoff)}` : row.matchId}</span>
                            {row.match ? (
                              <div>
                                <TeamInline team={row.match.homeTeam} />
                                <b>{row.homeScore} - {row.awayScore}</b>
                                <TeamInline team={row.match.awayTeam} />
                              </div>
                            ) : (
                              <strong>{row.homeScore} - {row.awayScore}</strong>
                            )}
                          </div>
                          <div className="wc-admin-vote-result">
                            <span>Resultado oficial</span>
                            {row.result && row.match ? (
                              <div>
                                <TeamInline team={row.match.homeTeam} />
                                <b>{formatResultScore(row.result)}</b>
                                <TeamInline team={row.match.awayTeam} />
                              </div>
                            ) : row.result ? (
                              <strong>{formatResultScore(row.result)}</strong>
                            ) : (
                              <strong>Pendiente</strong>
                            )}
                          </div>
                          <div className={`wc-admin-vote-scorecard is-${row.score?.code || 'pending'}`}>
                            <strong>{row.points === null || row.points === undefined ? 'Pendiente' : `${row.points} pts`}</strong>
                            <span>{row.score?.reason || 'Sin detalle de puntaje.'}</span>
                          </div>
                        </article>
                      )) : (
                        <div className="wc-empty-state">
                          <strong>No hay pronosticos para este filtro.</strong>
                          <span>Cuando un usuario guarde un resultado, va a aparecer aca.</span>
                        </div>
                      )}
                    </div>
                  </article>
                )}
              </section>
            )}

            {tab === 'login' && (
              <section className="wc-auth">
                <div className="wc-auth-grid">
                {token && userFromToken ? (
                  <article className="wc-card wc-my-predictions">
                    <div className="wc-section-head">
                      <h2>Mis predicciones</h2>
                      <p>{userFromToken.email}</p>
                    </div>
                    <div className="wc-prediction-summary">
                      <div>
                        <strong>{savedPredictionMatches.length}/{fixture.matches.length}</strong>
                        <span>pronosticos del fixture actual</span>
                      </div>
                      <p>{userFromToken.name}</p>
                    </div>
                    {missingPredictionMatches.length > 0 && (
                      <details className="wc-missing-predictions">
                        <summary>Te faltan {missingPredictionMatches.length} partidos</summary>
                        <div>
                          {missingPredictionMatches.map((match) => (
                            <button type="button" key={match.id} onClick={() => setTab('fixture')}>
                              <span>{formatGroupLabel(match)}</span>
                              <b>{match.homeTeam.name} vs {match.awayTeam.name}</b>
                              <small>{formatKickoff(match.kickoff)}</small>
                            </button>
                          ))}
                        </div>
                      </details>
                    )}
                    {savedPredictionMatches.length > 0 ? (
                      <div className="wc-prediction-grid">
                        {savedPredictionMatches.map((match) => (
                          <article className={`wc-prediction-card ${match.home === 'ARG' || match.away === 'ARG' ? 'is-arg' : ''}`} key={match.id}>
                            <div className="wc-match-top">
                              <span>{formatGroupLabel(match)}</span>
                              <small>{formatKickoff(match.kickoff)}</small>
                            </div>
                            <div className="wc-prediction-main">
                              <TeamInline team={match.homeTeam} />
                              <strong>{match.prediction.homeScore} - {match.prediction.awayScore}</strong>
                              <TeamInline team={match.awayTeam} />
                            </div>
                            <div className="wc-prediction-meta">
                              <span>Pronostico guardado</span>
                              {match.prediction.points !== undefined && <small>{match.prediction.points} pts</small>}
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <div className="wc-empty-state">
                        <strong>Todavia no guardaste predicciones.</strong>
                        <span>Elegi un partido del fixture y guarda el resultado para verlo aca.</span>
                      </div>
                    )}
                    <button type="button" className="wc-primary-btn" onClick={logout}>Cerrar sesion</button>
                  </article>
                ) : (
                  <form className="wc-card wc-auth-form" onSubmit={submitAuth}>
                    <div className="wc-section-head">
                      <h2>{mode === 'register' ? 'Crear usuario' : 'Ingresar'}</h2>
                      <p>Cuenta para participar del prode.</p>
                    </div>
                    {mode === 'register' && (
                      <label>
                        Nombre
                        <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} />
                      </label>
                    )}
                    <label>
                      Email
                      <input type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} />
                    </label>
                    <label>
                      Contrasena
                      <input type="password" value={form.password} onChange={(event) => updateForm('password', event.target.value)} />
                    </label>
                    <button type="submit" className="wc-primary-btn">{mode === 'register' ? 'Registrarme' : 'Entrar'}</button>
                    <button type="button" className="wc-link-btn" onClick={() => setMode(mode === 'register' ? 'login' : 'register')}>
                      {mode === 'register' ? 'Ya tengo cuenta' : 'Crear cuenta nueva'}
                    </button>
                  </form>
                )}
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
