import { Router } from "express";
import { createForumComment, likeComment, listForumComments, listForums, removeComment, updateComment } from "../controllers/forumController";

export const forumRoutes = Router();
export const commentRoutes = Router();

forumRoutes.get("/", listForums);
forumRoutes.get("/:forumId/comments", listForumComments);
forumRoutes.post("/:forumId/comments", createForumComment);

commentRoutes.put("/:commentId", updateComment);
commentRoutes.delete("/:commentId", removeComment);
commentRoutes.post("/:commentId/like", likeComment);
