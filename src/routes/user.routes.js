import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { validateUserID } from "../middlewares/user.middleware.js";


const router = Router()

router.post('/', UserController.store)
router.patch('/:id', validateUserID,UserController.updatePatch)
router.get('/', UserController.index)
router.get('/:id', validateUserID,UserController.getByID)

export default router