const { default: axios } = require('axios');

class Github {
  constructor(options) {
    this.repo = options.repo;
    this.commit = options.commit;
    this.branch = options.branch;
    this.url = options.url;
  }

  async update() {
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8876/update',
        data: {
          ...this
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Github;
