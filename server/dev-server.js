const express = require('express');

let app = express();
app.use(express.static('./dist'));
app.listen(8080);
