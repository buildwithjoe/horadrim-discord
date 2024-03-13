class CountLeaderBoard {
  constructor(client, guildId) {
    this.client = client;
    this.guildId = guildId;
  }
  get leaderBoard() {
    return this.client.get(this.guildId).leaderboard;
  }
  addScore(player, score) {
    const currentScore = this.leaderBoard.get(player) || 0;
    this.leaderBoard.set(player, currentScore + score);
    return this.leaderBoard;
  }
  resetScore(player) {
    this.leaderBoard.set(player, 0);
  }
  resetAll() {
    this.leaderBoard.clear();
  }
  getTopPlayers() {
    return this.leaderBoard
      .entries()
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }
}

module.exports = CountLeaderBoard;
