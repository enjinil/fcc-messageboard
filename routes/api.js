"use strict";

const CreateThread = require("../thread/useCases/CreateThread");
const CreateReply = require("../thread/useCases/CreateReply");
const DeleteThread = require("../thread/useCases/DeleteThread");
const DeleteReply = require("../thread/useCases/DeleteReply");
const ReportThread = require("../thread/useCases/ReportThread");
const ReportReply = require("../thread/useCases/ReportReply");
const ThreadRepo = require("../thread/repo/ThreadRepo");
const ReplyRepo = require("../thread/repo/ReplyRepo");

const threadRepo = new ThreadRepo();
const replyRepo = new ReplyRepo();

module.exports = function (app) {
  app
    .route("/api/threads/:board")
    .post(async (req, res) => {
      try {
        const { board } = req.params;
        const { text, delete_password } = req.body;

        if (!text || !delete_password) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const createThread = new CreateThread(threadRepo);
        const newThread = createThread.execute(board, text, delete_password);

        res.json(newThread.toJSON());
      } catch (error) {
        console.error("Error creating thread:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    })
    .get((req, res) => {
      try {
        const { board } = req.params;
        const threads = threadRepo.findByBoard(board);
        res.json(threads);
      } catch (error) {
        console.error("Error getting threads:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    })
    .delete((req, res) => {
      try {
        const { board } = req.params;
        const { thread_id, delete_password } = req.body;

        if (!thread_id || !delete_password) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const deleteThread = new DeleteThread(threadRepo);
        const result = deleteThread.execute(thread_id, board, delete_password);
        res.send(result.message);
      } catch (error) {
        console.error("Error deleting thread:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    })
    .put((req, res) => {
      try {
        const { board } = req.params;
        const { thread_id } = req.body;

        if (!thread_id) {
          return res.status(400).json({ error: "Missing thread_id" });
        }

        const reportThread = new ReportThread(threadRepo);
        const result = reportThread.execute(thread_id, board);
        res.send(result.message);
      } catch (error) {
        console.error("Error reporting thread:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

  app
    .route("/api/replies/:board")
    .post((req, res) => {
      try {
        const { board } = req.params;
        const { thread_id, text, delete_password } = req.body;

        if (!thread_id || !text || !delete_password) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const createReply = new CreateReply(threadRepo, replyRepo);
        const createdReply = createReply.execute(
          thread_id,
          board,
          text,
          delete_password,
        );

        if (!createdReply) {
          return res.status(404).json({ error: "Thread not found" });
        }

        res.json(createdReply.toJSON());
      } catch (error) {
        console.error("Error creating reply:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    })
    .get((req, res) => {
      try {
        const { board } = req.params;
        const { thread_id } = req.query;

        if (!thread_id) {
          return res.status(400).json({ error: "Missing thread_id" });
        }

        const thread = threadRepo.findById(thread_id, board);

        if (!thread) {
          return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread);
      } catch (error) {
        console.error("Error getting thread:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    })
    .delete((req, res) => {
      try {
        const { board } = req.params;
        const { thread_id, reply_id, delete_password } = req.body;

        if (!thread_id || !reply_id || !delete_password) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const deleteReply = new DeleteReply(threadRepo);
        const result = deleteReply.execute(
          thread_id,
          board,
          reply_id,
          delete_password,
        );
        res.send(result.message);
      } catch (error) {
        console.error("Error deleting reply:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    })
    .put((req, res) => {
      try {
        const { board } = req.params;
        const { thread_id, reply_id } = req.body;

        if (!thread_id || !reply_id) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const reportReply = new ReportReply(threadRepo);
        const result = reportReply.execute(thread_id, board, reply_id);
        res.send(result.message);
      } catch (error) {
        console.error("Error reporting reply:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
};
