import User from "../models/user.js";
import { SECRET_KEY } from "../config/config.js";
import jwt from 'jsonwebtoken'

export const validateJWT = async (q, r, next) => {
    try {

        const { authorization } = q.headers
        if (!authorization) return r.status(400).json({ message: 'Se debe proveer un token' })

        const decodificado = jwt.verify(authorization, SECRET_KEY)
        const user = await User.findById(decodificado.userId)

        q.user = user
        next()

    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) return r.status(400).json({ message: 'Token expirado' })

        if (error instanceof jwt.JsonWebTokenError) return r.status(400).json({ message: 'Token inválido' })

        r.status(500).json({ message: 'Error al validar el token' })

    }
}