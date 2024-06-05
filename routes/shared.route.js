import { Router } from "express";
import * as SharedController from "../controllers/shared/shared.controller.js"
const router = Router();


router.get("/ping", SharedController.getPing);
router.post("/member/add", SharedController.addMember);
router.get("/member/fetch", SharedController.getMembers);

 
export default router;