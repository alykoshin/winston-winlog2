'use strict';

const winston = require('winston');
//const winlog3 = (process.platform === 'win32') ? require('winston-winlog3') : null;
//const winlog3 = require('winston-winlog3');
const winlog3 = require('../../'); // this package (winston-winlog3)

const categoryName = 'categoryName';

// Create custom Winston Transport
const winlogTransport = new (winlog3)({
  label:     categoryName,
  json:      false,
  //handleExceptions: true,
  timestamp: true,
  eventLog:  'APPLICATION',
  source:    'node',
  method:    'eventcreate'
});

// Add Treansport to Winston's Loggers
const logger = winston.loggers.add(categoryName, {
  transports: [ winlogTransport ]
});



console.log('1. Passing simple message to Windows Event Log');

logger.info('This message has no extended data (meta)');


console.log('2. Passing message with meta object containing id field (corresponding to Event ID) to Windows Event Log');

var meta = {
  id: 123,
  status: 500,
  message: 'This is generic object to pass to Windows Event Log'
};


logger.log('info', 'This message has additional meta object', meta);

console.log('3. Passing message with generic Javascript Error object (augmented with id) to Windows Event Log');

let err = new Error('This is generic Javascript Error object.');
err.id = 321;       // augment with `id` property to pass to Windows Event Log
err.status = 500;   // augment with custom property to pass to Windows Event Log
let msg = 'ERROR: ' + err.message + ' Stack info:' +err.stack;
msg.replace('\n', '\r\n');

logger.error(msg, err);


console.log('DONE. Please open Windows Event Log to check the messages.');
