import { Router } from "express";
import { listUserComments, listUsers, removeUser, showUser } from "../controllers/userController";

export const userRoutes = Router();

userRoutes.get("/", listUsers);
userRoutes.get("/:userId", showUser);
userRoutes.get("/:userId/comments", listUserComments);
userRoutes.delete("/:userId", removeUser);
