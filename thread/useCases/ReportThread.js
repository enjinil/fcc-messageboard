class ReportThread {
  constructor(threadRepo) {
    this.threadRepo = threadRepo;
  }

  execute(threadId, board) {
    const thread = this.threadRepo.findById(threadId, board);
    
    if (!thread) {
      return { success: false, message: "thread not found" };
    }

    thread.report();
    return { success: true, message: "reported" };
  }
}

module.exports = ReportThread;
