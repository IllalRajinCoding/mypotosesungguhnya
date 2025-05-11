
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.resolve('./views.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.count += 1;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ count: data.count });
}
