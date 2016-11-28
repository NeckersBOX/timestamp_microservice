'use strict';

const http = require ('http');
const express = require ('express');
let app = express ();

app.get ('/:date', (req, res) => {
 res.writeHead (200, { 'Content-Type': 'application/json'});

 res.end (JSON.stringify ({ param: req.params.date }));
});

app.listen (8080);
