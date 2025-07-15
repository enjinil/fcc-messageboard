const Reply = require("../entity/Reply");

class CreateReply {
  constructor(threadRepo, replyRepo) {
    this.threadRepo = threadRepo;
    this.replyRepo = replyRepo;
  }

  execute(threadId, board, text, deletePassword) {
    const thread = this.threadRepo.findById(threadId, board);
    if (!thread) return null;

    const id = this.replyRepo.generateId();
    const reply = new Reply(id, text, deletePassword);
    
    thread.addReply(reply);
    return reply;
  }
}

module.exports = CreateReply;
