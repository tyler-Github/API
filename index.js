const express = require('express');
const axios = require('axios');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.get('/', (req, res) => {
  res.render('index', { request: req, response: null });
});

function formatJSON(obj) {
  const jsonString = JSON.stringify(obj, null, 2);
  const htmlString = jsonString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"([^"]+)":/g, '<span>"$1":</span>')
    .replace(/<span class="property">"(.*?)"<\/span>/g, '<span class="property">"$1"</span>')
    .replace(/"([^"]+)"/g, '<span class="string">"$1"</span>')
    .replace(/\b(true|false)\b/g, '<span class="boolean">$1</span>')
    .replace(/\b(null)\b/g, '<span class="null">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
    .replace(/([\{\}\[\],])/g, '<span class="punctuation">$1</span>');

  return htmlString;
}

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('request', async (requestData) => {
    try {
      const { method, url, headers, data } = requestData;
      const parsedHeaders = headers ? JSON.parse(headers) : {};
      const response = await axios({ method, url, headers: parsedHeaders, data });
      socket.emit('response', { data: response.data });
    } catch (error) {
      socket.emit('response', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
