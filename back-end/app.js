const express = require('express');
const cors = require('cors')

const app = express();

const index = require('./routes/index.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors());

app.use(index);

app.listen(3000, () => {
    console.log('Listen to port 3000, well actually 4000');
});
