class DeleteThread {
  constructor(threadRepo) {
    this.threadRepo = threadRepo;
  }

  execute(threadId, board, deletePassword) {
    const thread = this.threadRepo.findById(threadId, board);
    
    if (!thread) {
      return { success: false, message: "thread not found" };
    }

    if (!thread.validateDeletePassword(deletePassword)) {
      return { success: false, message: "incorrect password" };
    }

    this.threadRepo.delete(threadId, board);
    return { success: true, message: "success" };
  }
}

module.exports = DeleteThread;