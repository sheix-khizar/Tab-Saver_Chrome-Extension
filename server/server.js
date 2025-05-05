
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const DATA_PATH = './data/tabGroups.json';
if (!fs.existsSync(DATA_PATH)) {
  fs.writeFileSync(DATA_PATH, JSON.stringify({}));
}

app.post('/save-group', (req, res) => {
  const { groupName, urls } = req.body;
  const groups = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  groups[groupName] = urls;
  fs.writeFileSync(DATA_PATH, JSON.stringify(groups, null, 2));
  res.json({ success: true, message: 'Group saved' });
});

app.get('/groups', (req, res) => {
  const groups = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  res.json(groups);
});

app.delete('/groups/:groupName', (req, res) => {
  const { groupName } = req.params;
  const groups = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  delete groups[groupName];
  fs.writeFileSync(DATA_PATH, JSON.stringify(groups, null, 2));
  res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
