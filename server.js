var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var path = require('path');

var app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve our static assets
app.use(express.static(path.resolve(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.post('/addNumbers', (req, res) => {
  const { numbers } = req.body;

  const answer = numbers.reduce((acc, cur) => acc + parseInt(cur), 0);

  res.send(JSON.stringify(answer));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

module.exports = app;
