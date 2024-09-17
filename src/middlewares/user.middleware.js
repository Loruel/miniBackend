import User from "../models/user.js"

export const validateUserID = async (q, r, next) => {
    try {

        const { id } = q.params
        const user = await User.findById(id)

        if (!user) return r.status(404).json({ message: 'El usuarion no existe' })

        q.user = user
        next()

    } catch (error) {
        r.status(500).json({ message: 'Error al validar el ID' })
    }
}