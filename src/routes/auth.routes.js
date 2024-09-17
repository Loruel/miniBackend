import { Router } from "express"
import AuthoController from "../controllers/auth.controller.js"
import { validateJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.post('/login', AuthoController.login)
router.post('/register', AuthoController.register)
router.get('/me', validateJWT,AuthoController.me)
router.patch('/me', validateJWT, AuthoController.updateProfile)


export default router