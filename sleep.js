var m_sleep = require('sleep');

module.exports = function(time) {
  us_time = Math.round(time * 1000000.0);
  m_sleep.usleep(us_time);
};
