'use strict';

const http = require ('http');
const express = require ('express');
const fs = require ('fs');
const marked = require('marked');

let app = express ();

const lookup_month = [ 'january', 'february', 'march', 'april', 'may',
                       'june', 'july', 'august', 'september', 'october',
                       'november', 'december' ];

const capitalize = (string) => (string[0].toUpperCase () + string.substr (1, string.length));

const send_unixtime = (time, res) => {
  let date = new Date (time * 1000);

  res.end (JSON.stringify ({
    natural: capitalize (lookup_month[date.getMonth ()]) + ' ' + date.getDate () + ', ' + date.getFullYear (),
    unix: Math.round (date.getTime () / 1000)
  }));

  return true;
};

const send_naturaltime = (date_info, res) => {
  let date = new Date ();
  let index_month = lookup_month.indexOf (date_info[1].toLowerCase ());

  if ( index_month == -1 && /^[0-9]{1,2}$/.test (date_info[1]) === false )
       return true;

  date = new Date ();

  if ( index_month != -1 )
       date.setMonth (index_month);
  else {
     if ( +date_info[1] < 1 || +date_info[1] > 12 )
          return true;

     date.setMonth (+date_info[1] - 1);
  }

  if ( date_info[3] != '' )
       date.setDate (+date_info[3]);

  if ( date_info[4] != '' ) {
       if ( date_info[4].length == 4 )
            date.setFullYear (+date_info[4]);
       else date.setYear (+date_info[4]);
  }

  res.end (JSON.stringify ({
    natural: capitalize (lookup_month[date.getMonth ()]) + ' ' + date.getDate () + ', ' + date.getFullYear (),
    unix: Math.round (date.getTime () / 1000)
  }));
}

app.get ('/:date', (req, res) => {
 let result = false;
 const date_regex = /^([A-Za-z]+|[0-9]{1,2})([ ,-]{1,}:?([0-9]{1,2}))?[ ,-]{1,}([0-9]{1,4})$/;
 res.writeHead (200, { 'Content-Type': 'application/json'});

      if ( /^\d+$/.test (req.params.date) === true )
           result = send_unixtime (+req.params.date, res);
 else if ( date_regex.test (req.params.date) === true )
           result = send_naturaltime (date_regex.exec (req.params.date), res);

 if ( result === false )
   res.end (JSON.stringify ({ natural: null, unix: null }));
});


app.get ('*', (req, res) => {
  res.writeHead (200, { 'Content-Type': 'text/html'});
  let buf = fs.readFileSync ('README.md');
  res.end ('<html><head><title>Neckers Timestamp Microservice</title></head><body>'
          + marked (buf.toString ())
          + '</body></html>');
});

app.listen (process.env.PORT || 8080);
