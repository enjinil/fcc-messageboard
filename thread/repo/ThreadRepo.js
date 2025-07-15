class ThreadRepo {
  constructor() {
    this.threads = [];
    this.nextId = 1;
  }

  generateId() {
    return (this.nextId++).toString();
  }

  save(thread) {
    this.threads.push(thread);
    return thread;
  }

  findById(threadId, board) {
    return this.threads.find(
      thread => thread._id === threadId && thread.board === board
    );
  }

  findByBoard(board) {
    return this.threads
      .filter(thread => thread.board === board)
      .sort((a, b) => new Date(b.bumped_on) - new Date(a.bumped_on));
  }

  delete(threadId, board) {
    const threadIndex = this.threads.findIndex(
      thread => thread._id === threadId && thread.board === board
    );
    
    if (threadIndex !== -1) {
      this.threads.splice(threadIndex, 1);
      return true;
    }
    return false;
  }

  clearAll() {
    this.threads = [];
    this.nextId = 1;
  }
}

module.exports = ThreadRepo;
