const express = require('express')
const app = express();
const path = require('path');

app.use('/', express.static(path.join(__dirname,'www')));

app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, 'www', 'index.html'));
});


app.listen(process.env.PORT || 5000)