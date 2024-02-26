class Github {
  constructor(options) {
    (this.repo = options.repo), (this.commit = options.commit);
    this.branch = options.branch;
    this.url = options.url;
  }
}
