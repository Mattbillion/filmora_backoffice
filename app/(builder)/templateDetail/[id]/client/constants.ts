/**
 * @typedef {Object} TicketComponentMap
 * @description Mapping of single-character codes to human-readable names for ticket components.
 * Used to parse encoded ticket strings like `r0003-ZV-F5-U15-P10000`. All keys are case-sensitive.
 *
 * @property {string} Z Zone identifier (broad venue division). Example: `ZV` → Zone "V" (VIP)
 * @property {string} S Sector subdivision within a zone. Example: `SA` → Sector "A"
 * @property {string} B Block grouping within a sector. Example: `B12` → Block 12
 * @property {string} J Physical section name. Example: `JB` → Section "Balcony"
 * @property {string} s Individual seat number. Example: `s25A` → Seat 25A
 * @property {string} t Table number. Example: `t42` → Table 42
 * @property {string} R Row identifier. Example: `RR12` → Row 12
 * @property {string} r Room number/name. Example: `r003` → Room 003
 * @property {string} F Floor level. Example: `F5` → Floor 5
 * @property {string} P Price value. Example: `P10000` → Price 10,000
 * @property {string} U Quantity of tickets. Example: `U15` → 15 tickets
 * @property {string} D Datetime in ISO 8601 format. Example: `D2023-10-05T19:30` → Oct 5, 2023 7:30 PM
 * @property {string} G Gate number. Example: `G4` → Gate 4
 * @property {string} E Entrance identifier. Example: `EN2` → Entrance North 2
 */

/**
 * @constant {TicketComponentMap} dataMap
 * @example
 * // Parsing ticket code 'r003-ZV-F5-U15-P10000':
 * // {
 * //   room: '003',
 * //   zone: 'V',
 * //   floor: '5',
 * //   unit: '15',
 * //   price: '10000'
 * // }
 */
export const dataMap = {
  Z: 'zone',
  S: 'sector',
  B: 'block',
  J: 'section',
  s: 'seat',
  t: 'table',
  R: 'row',
  r: 'room',
  F: 'floor',
  P: 'price',
  U: 'unit',
  D: 'date',
  G: 'gate',
  E: 'entrance',
} as const;

export const dataMapReverse = Object.fromEntries(
  Object.entries(dataMap).map(([k, v]) => [v, k]),
);

export const translationMap: Record<string, string> = {
  seat: 'Суудал',
  table: 'Ширээ',
  row: 'Эгнээ',
  sector: 'Сектор',
  room: 'Өрөө',
  zone: 'Zone',
  gate: 'Gate',
  floor: 'Давхар',
  date: 'Огноо',
  unit: 'Хүний тоо',
  price: 'Үнэ',
  entrance: 'Орц / Хаалга',
  section: 'Хэсэг',
  name: 'Хэсэг',
  block: 'Блок',
};

const INITIAL_SCALE = { x: 0.9, y: 0.9 };

export const KEY_CHARS = Object.keys(dataMap).join('');

export const idRegex = new RegExp(
  `^[${KEY_CHARS}]\\w+(?:[-_][${KEY_CHARS}\\w]\\w+)*$`,
);
