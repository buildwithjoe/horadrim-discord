(function () {
  const Client = new (require('./bases/CustomClient'))();
  Client.load().login();
})();
