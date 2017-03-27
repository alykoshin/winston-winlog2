var winston = require('winston'),
    //winlog = require('winston-winlog3');
    winlog = require('../../');

winston.add(winlog, { source: 'myapp' });

winston.info('this is an info message', { id: 1 });
winston.warn('this is an warning message', { id: 2 });
winston.error('this is an error message', { id: 3 });
