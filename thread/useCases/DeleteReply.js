class DeleteReply {
  constructor(threadRepo) {
    this.threadRepo = threadRepo;
  }

  execute(threadId, board, replyId, deletePassword) {
    const thread = this.threadRepo.findById(threadId, board);
    if (!thread) {
      return { success: false, message: "thread not found" };
    }

    const reply = thread.replies.find(reply => reply._id === replyId);
    if (!reply) {
      return { success: false, message: "reply not found" };
    }

    if (!reply.validateDeletePassword(deletePassword)) {
      return { success: false, message: "incorrect password" };
    }

    reply.markAsDeleted();
    return { success: true, message: "success" };
  }
}

module.exports = DeleteReply;
