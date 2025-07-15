class ReplyRepo {
  constructor() {
    this.nextId = 1;
  }

  generateId() {
    return (this.nextId++).toString();
  }

  clearAll() {
    this.nextId = 1;
  }
}

module.exports = ReplyRepo;
