(function () {
  const Client = new (require('./bases/CustomClient'))();
  Client.loadEvents().loadCommands().login();
})();
