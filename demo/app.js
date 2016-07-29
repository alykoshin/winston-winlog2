'use strict';

var appErrors = require('mini-rest-errors').appErrors;
var AppError = require('mini-rest-errors').AppError;
var logger = require('mini-rest-logger')({ winlog_throttle: { maxCalls: 2 } });


console.log('*******************************************************************');

var err = new Error('This is classic JS Error object message');
err.id = 321;
logger.error('logger message (with classic Error object)', err);


console.log('*******************************************************************');

appErrors.newAppError2 = {
  id: 123,
  status: 500,
  message: 'newAppError2 Message'
};

var err = new AppError('newAppError2', 'This is AppError object message');
logger.error('logger message (with AppError object)', err);

