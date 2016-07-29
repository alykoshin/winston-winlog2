/*jslint node: true */
'use strict';

var util = require('util');
var circularJson = require('circular-json');
var Transport = require('winston').Transport;

var EventLogger;
try {
	var nodeWindows = require('node-windows');
	EventLogger = nodeWindows.EventLogger;
}
catch ( err ) {
}


var EventLog = function (options) {
	Transport.call(this, options);
	options = options || {};

	this.name = 'eventlog';

	if ( EventLogger ) {
		var eventLog = options.eventLog || "APPLICATION"; //SYSTEM is also valid.
		var source = options.source || "node";
		this.logger = new EventLogger(source, eventLog);
	}
};

util.inherits(EventLog, Transport);


EventLog.prototype.log = function (level, msg, meta, callback) {
	if (this.silent || !this.logger) {
		return callback(null, true);
	}
	var that = this;
	var message = msg;
	if ( meta && Object.keys(meta).length > 0 ) {
		try {
			message += " metadata: " + circularJson.stringify(meta, null, 2);
		}
		catch( err ) {
			message += " metadata: [Could not parse]";
		}
	}
	// new lines not supported by node-windows as it passes message on the command line through child_process.exec: Remove them
	message = message.replace( /[\r\n]+/g, ' ' );
  // replace double quotes with single to allow proper command line handling  
  message = message.replace( /"+/g, '\'' );

  var eventId = meta && meta.id || 100;
  eventId = (eventId < 1) ? 1 : (eventId >1000) ? 1000 : eventId;

  var cb = function( err ) {
		that.emit('logged');
		callback(null, true);
	};

	switch ( level ) {
		default:
		case "info":
			this.logger.info(message, eventId, cb );
			break;
		case "warn":
			this.logger.warn(message, eventId, cb);
			break;
		case "error":
			this.logger.error(message, eventId, cb);
			break;
	}
};

module.exports = EventLog;

