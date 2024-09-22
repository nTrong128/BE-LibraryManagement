import {Router} from "express";
import {createItem, getItems} from "../controllers/itemController";

const router = Router();

router.get("/items", getItems);
router.post("/items", createItem);

export {router};
