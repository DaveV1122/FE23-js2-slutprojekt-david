import { Request, Response, NextFunction } from "express";
import { addComment, deleteComment, editComment, getForumComments, getForums, toggleLike } from "../services/forumService";

export async function listForums(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await getForums());
  } catch (error) {
    next(error);
  }
}

export async function listForumComments(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await getForumComments(req.params.forumId));
  } catch (error) {
    next(error);
  }
}

export async function createForumComment(req: Request, res: Response, next: NextFunction) {
  try {
    const comment = await addComment(req.params.forumId, req.body?.userId, req.body?.text);
    res.status(201).json({ comment, message: "Kommentaren publicerades." });
  } catch (error) {
    next(error);
  }
}

export async function updateComment(req: Request, res: Response, next: NextFunction) {
  try {
    const comment = await editComment(req.params.commentId, req.body?.userId, req.body?.text);
    res.json({ comment, message: "Kommentaren uppdaterades." });
  } catch (error) {
    next(error);
  }
}

export async function removeComment(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteComment(req.params.commentId, req.body?.userId);
    res.json({ message: "Kommentaren togs bort." });
  } catch (error) {
    next(error);
  }
}

export async function likeComment(req: Request, res: Response, next: NextFunction) {
  try {
    const comment = await toggleLike(req.params.commentId, req.body?.userId);
    res.json({ comment, message: "Gilla-markeringen uppdaterades." });
  } catch (error) {
    next(error);
  }
}
