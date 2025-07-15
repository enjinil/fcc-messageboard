class ReportReply {
  constructor(threadRepo) {
    this.threadRepo = threadRepo;
  }

  execute(threadId, board, replyId) {
    const thread = this.threadRepo.findById(threadId, board);
    if (!thread) {
      return { success: false, message: "thread not found" };
    }

    const reply = thread.replies.find(reply => reply._id === replyId);
    if (!reply) {
      return { success: false, message: "reply not found" };
    }

    reply.report();
    return { success: true, message: "reported" };
  }
}

module.exports = ReportReply;