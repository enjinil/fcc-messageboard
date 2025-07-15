
const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  it("Creating a new thread: POST request to /api/threads/{board}", (done) => {
    const testBoard = "test-board";
    const testPassword = "test-password";

    chai
      .request(server)
      .post(`/api/threads/${testBoard}`)
      .send({
        text: "test thread",
        delete_password: testPassword,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, "test thread");
        testThreadId = res.body._id;
        done();
      });
  });

  it("Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}", (done) => {
    initializeThreadAndReply().then(({ testBoard }) => {
      chai
        .request(server)
        .get(`/api/threads/${testBoard}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtMost(res.body.length, 10);
          if (res.body.length > 0 && res.body[0].replies) {
            assert.isAtMost(res.body[0].replies.length, 3);
          }
          done();
        });
    });
  });

  it("Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password", (done) => {
    initializeThreadAndReply().then(
      ({ testBoard, wrongPassword, testThreadId }) => {
        chai
          .request(server)
          .delete(`/api/threads/${testBoard}`)
          .send({
            thread_id: testThreadId,
            delete_password: wrongPassword,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
          });
      },
    );
  });

  it("Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password", (done) => {
    initializeThreadAndReply().then(
      ({ testBoard, testPassword, testThreadId }) => {
        chai
          .request(server)
          .delete(`/api/threads/${testBoard}`)
          .send({
            thread_id: testThreadId,
            delete_password: testPassword,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      },
    );
  });

  it("Reporting a thread: PUT request to /api/threads/{board}", (done) => {
    initializeThreadAndReply().then(({ testBoard, testThreadId }) => {
      chai
        .request(server)
        .put(`/api/threads/${testBoard}`)
        .send({
          thread_id: testThreadId,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "reported");
          done();
        });
    });
  });

  it("Creating a new reply: POST request to /api/replies/{board}", (done) => {
    initializeThreadAndReply().then(
      ({ testBoard, testPassword, testThreadId }) => {
        chai
          .request(server)
          .post(`/api/replies/${testBoard}`)
          .send({
            thread_id: testThreadId,
            text: "test reply",
            delete_password: testPassword,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.text, "test reply");
            testReplyId = res.body._id;
            done();
          });
      },
    );
  });

  it("Viewing a single thread with all replies: GET request to /api/replies/{board}", (done) => {
    initializeThreadAndReply().then(({ testBoard, testThreadId }) => {
      chai
        .request(server)
        .get(`/api/replies/${testBoard}`)
        .query({
          thread_id: testThreadId,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, testThreadId);
          assert.isArray(res.body.replies);
          done();
        });
    });
  });

  it("Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password", (done) => {
    initializeThreadAndReply().then(
      ({ testBoard, wrongPassword, testThreadId, testReplyId }) => {
        chai
          .request(server)
          .delete(`/api/replies/${testBoard}`)
          .send({
            thread_id: testThreadId,
            reply_id: testReplyId,
            delete_password: wrongPassword,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
          });
      },
    );
  });

  it("Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password", (done) => {
    initializeThreadAndReply().then(
      ({ testBoard, testPassword, testThreadId, testReplyId }) => {
        chai
          .request(server)
          .delete(`/api/replies/${testBoard}`)
          .send({
            thread_id: testThreadId,
            reply_id: testReplyId,
            delete_password: testPassword,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      },
    );
  });

  it("Reporting a reply: PUT request to /api/replies/{board}", (done) => {
    initializeThreadAndReply().then(
      ({ testBoard, testThreadId, testReplyId }) => {
        chai
          .request(server)
          .put(`/api/replies/${testBoard}`)
          .send({
            thread_id: testThreadId,
            reply_id: testReplyId,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "reported");
            done();
          });
      },
    );
  });
});

function initializeThreadAndReply() {
  return new Promise((resolve, reject) => {
    const testBoard = "test-board" + Math.random().toString(36).substring(7);
    const testPassword = "test-password";
    const wrongPassword = "wrong-password";
    let testThreadId;
    let testReplyId;

    // Create a new thread first
    chai
      .request(server)
      .post(`/api/threads/${testBoard}`)
      .send({
        text: "test thread",
        delete_password: testPassword,
      })
      .end((err, res) => {
        if (err) return reject(err);
        testThreadId = res.body._id;

        // Then create a reply to that thread
        chai
          .request(server)
          .post(`/api/replies/${testBoard}`)
          .send({
            thread_id: testThreadId,
            text: "test reply",
            delete_password: testPassword,
          })
          .end((err, res) => {
            if (err) return reject(err);
            testReplyId = res.body._id;

            resolve({
              testBoard,
              testPassword,
              wrongPassword,
              testThreadId,
              testReplyId,
            });
          });
      });
  });
}
