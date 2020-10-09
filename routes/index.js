'use strict';

const home = {
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return 'Hello World !';
  },
};

module.exports = [home];
