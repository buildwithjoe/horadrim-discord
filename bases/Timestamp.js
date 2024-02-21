const dayjs = require('dayjs');
class Timestamp {
  constructor(options) {
    this.timestamp = options;
    this.time = dayjs(this.timestamp);
  }
  format(string = 'ddd MM-DD-YY h:mm:ssa') {
    const time = this.time.format(string);
    this.formatted = time;
    return this;
  }
}
module.exports = Timestamp;
