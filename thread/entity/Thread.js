class Thread {
  constructor(id, text, deletePassword, board, createdOn = new Date()) {
    this._id = id;
    this.text = text;
    this.delete_password = deletePassword;
    this.board = board;
    this.created_on = createdOn;
    this.bumped_on = createdOn;
    this.reported = false;
    this.replies = [];
  }

  addReply(reply) {
    this.replies.push(reply);
    this.bumped_on = new Date();
  }

  removeReply(replyId) {
    const replyIndex = this.replies.findIndex(reply => reply._id === replyId);
    if (replyIndex !== -1) {
      this.replies.splice(replyIndex, 1);
    }
  }

  markReplyAsDeleted(replyId) {
    const reply = this.replies.find(reply => reply._id === replyId);
    if (reply) {
      reply.text = "[deleted]";
    }
  }

  report() {
    this.reported = true;
  }

  validateDeletePassword(password) {
    return this.delete_password === password;
  }

  toJSON() {
    return {
      _id: this._id,
      text: this.text,
      created_on: this.created_on,
      bumped_on: this.bumped_on,
      reported: this.reported,
      replies: this.replies,
    };
  }

  toSummaryJSON() {
    return {
      _id: this._id,
      text: this.text,
      created_on: this.created_on,
      bumped_on: this.bumped_on,
      replies: this.replies.slice(-3).map(reply => ({
        _id: reply._id,
        text: reply.text,
        created_on: reply.created_on,
      })),
      replycount: this.replies.length,
    };
  }
}

module.exports = Thread;
