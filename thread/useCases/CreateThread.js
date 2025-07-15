const Thread = require("../entity/Thread");

class CreateThread {
  constructor(threadRepo) {
    this.threadRepo = threadRepo;
  }

  execute(board, text, deletePassword) {
    const id = this.threadRepo.generateId();
    const thread = new Thread(id, text, deletePassword, board);
    return this.threadRepo.save(thread);
  }
}

module.exports = CreateThread;
