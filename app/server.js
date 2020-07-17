const express = require('express')
const bodyParser = require('body-parser')
const myKafka = require('./myKafka');

const app = express();

app.use(express.static(__dirname))

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile('./main.html', { root: __dirname })
})

app.post('/sendMessage', (req, res) => {
    let message = req.body.message

    console.log(` [Writing] Message: ${message}`);
    
    myKafka.writeToKafka(message)
    res.end();
})

app.get('/readMessage', (req, res) => {
    myKafka.readFromKafka().pipe(res);
})

app.listen(5000, () => {
    console.log('App listening on port 5000');
})