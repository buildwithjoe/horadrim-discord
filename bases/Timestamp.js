const dayjs = require('dayjs');
class Timestamp {
  constructor(options) {
    this.timestamp = options;
    this.time = dayjs(this.timestamp);
  }
  format(string = 'h:mm:ssa ddd MM-DD-YY') {
    const time = this.time.format(string);
    this.formatted = time;

    return this;
  }
}
module.exports = Timestamp;
