var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');

var app = express();

var requestCtrl = require('./apiControllers/requestController');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        msg: 'hello from nodejs express api'
    })
});

app.use('/request', requestCtrl);

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`PHI API is running on port ${port}`);
})