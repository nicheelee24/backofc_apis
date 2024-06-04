import { Router } from "express";
import * as SharedController from "../controllers/shared/shared.controller"
const router: Router = Router();


router.get("/ping", SharedController.getPing);
router.post("/member/add", SharedController.addMember);

 
export default router;