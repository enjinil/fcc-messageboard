class Reply {
  constructor(id, text, deletePassword, createdOn = new Date()) {
    this._id = id;
    this.text = text;
    this.delete_password = deletePassword;
    this.created_on = createdOn;
    this.reported = false;
  }

  report() {
    this.reported = true;
  }

  validateDeletePassword(password) {
    return this.delete_password === password;
  }

  markAsDeleted() {
    this.text = "[deleted]";
  }

  toJSON() {
    return {
      _id: this._id,
      text: this.text,
      created_on: this.created_on,
    };
  }
}

module.exports = Reply;
