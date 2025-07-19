const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello from notification-service!'));

app.listen(PORT, () => console.log('Service running on port ' + PORT));