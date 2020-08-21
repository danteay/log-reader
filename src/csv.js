import {
  createObjectCsvWriter
} from 'csv-writer';


const HEADERS = [{
    id: 'ip',
    title: 'IP'
  },
  {
    id: 'country',
    title: 'Country'
  },
  {
    id: 'region',
    title: 'Region'
  },
  {
    id: 'city',
    title: 'City'
  },
  {
    id: 'date',
    title: 'Date'
  },
  {
    id: 'method',
    title: 'Method'
  },
  {
    id: 'statusCode',
    title: 'Status'
  },
  {
    id: 'duration',
    title: 'Duration'
  },
  {
    id: 'url',
    title: 'Reference'
  },
  {
    id: 'http',
    title: 'HTTP'
  },
  {
    id: "userAgent",
    title: "Agent"
  },
  {
    id: 'device',
    title: 'Device'
  },
  {
    id: 'os',
    title: 'OS'
  },
  {
    id: 'browser',
    title: 'Browser'
  },
];


export default async (path, records) => {
  const writer = createObjectCsvWriter({
    path: path,
    header: HEADERS
  });

  await writer.writeRecords(records);
}