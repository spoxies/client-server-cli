#!/usr/bin/env node

"use strict";

var express = require('express')
  , fs = require('fs')
  , path = require('path')
  , htmlRegex = /\.html$/;

// Include extrernal libs
const commandLineArgs = require( 'command-line-args' );

// Declare CLI options
const optionDefinitions = [
  { name: 'src', alias: 'c', type: String },
  { name: 'not-found', alias: 'n', type: String },
  { name: 'port', alias: 'p', type: String }
];

// CLI arguments lib
const options = commandLineArgs( optionDefinitions, { partial: true, camelCase: true } );

var app = express();

// Serve assets folder
app.use( '/assets', express.static( options.src + '/assets' ) );

// Serve JavaScript folder
app.use( '/assets/js', express.static( options.src + '/js' ) );

app.get('/*', function(req, res){
  var errorPage = path.join( process.cwd(), options.src + '/html/' + options.notFound );
  
  if( req.url.match(htmlRegex) ) {
    var filePath = path.join( process.cwd(), options.src + '/html' + req.url );

    fs.exists( options.src + '/html' + req.url, function(exists){
 
      if( exists ) {//If file exists then serve it  

        try{

          res.sendFile( filePath );

        } catch ( error ) {

          var msg = error.toString();
          msg =  msg.replace(new RegExp('>','g'), '&gt;');
          msg =  msg.replace(new RegExp('\n','g'), '<br>');
          res.send( msg );

        }
      } else {
        res.status(404).sendFile( errorPage );
      }
      
    });
  } else {
    res.status(404).sendFile( errorPage );
  }

});

app.listen(options.port);

console.log('Starting web server on: http://localhost:' + options.port + '/index.html');


module.exports = app;