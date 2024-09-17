import User from "../models/user.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from "../config/config.js"

class AuthoController {

    static async login(q, r) {
        try {

            const { correo, contraseña } = q.body

            if (!correo || !contraseña) {
                return r.status(400).json({ message: 'Correo y contraseña son requeridos' })
            }

            const user = await User.findOne('email', correo)
            if (!user) return r.status(404).json({ message: 'Usuario no encontrado' })

            const esValida = await bcrypt.compare(contraseña, user.password)
            if (!esValida) return r.status(401).json({ message: 'Credenciales invalidas' })

            const token = jwt.sign({ userId: user.user_id }, SECRET_KEY, { expiresIn: '1h' })
            r.json({ message: 'inicio de sesión exitoso', token })

        } catch (error) {

            r.status(500).json({ message: error.message })

        }
    }

    static async register(q, r) {
        try {

            const { correo, contraseña } = q.body

            const existUser = await User.findOne('email', correo)
            if (existUser) return r.status(400).json({ message: 'Este correo ya ha sido registrado' })

            if (!correo || !contraseña) {
                return r.status(400).json({
                    message: 'Correo y contraseña son requeridos'
                })
            }

            const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailValidate.test(correo)) {
                return r.status(400).json({
                    message: 'El correo no tiene un formato válido'
                })
            }

            const passwordValidate = /^(?=.*[A-Z]).{8,}$/
            if (!passwordValidate.test(contraseña)) {
                return r.status(400).json({
                    message: 'La contraseña debe tener al menos 8 caracteres y al menos una letra mayúscula'
                })
            }

            const encriptadaPassword = await bcrypt.hash(contraseña, 10)

            const newUser = {
                correo: correo,
                contraseña: encriptadaPassword
            }

            const result = await User.create(newUser)

            const token = jwt.sign({ userId: result.user_id }, SECRET_KEY, { expiresIn: '1h' })
            r.status(201).json({ message: 'Registro exitoso', token })

        } catch (error) {

            r.status(500).json({ message: error.message })

        }
    }

    static async me(q, r) {
        try {

            delete q.user.password
            r.json(q.user)

        } catch (error) {

            r.status(500).json({ message: error.message })

        }
    }

    static async updateProfile(q, r) {
        try {

            const { nombre, descripcion, correo, telefono, contraseña, foto } = q.body
            const userId = q.user.user_id

            const updateUser = await User.update({
                usuario: userId,
                nombre,
                descripcion,
                correo,
                telefono,
                contraseña,
                foto
            })

            if (!updateUser || updateUser.affectedRows === 0) {
                return r.status(400).json({ message: 'No existen datos que actualizar' })
            }

            const user = await User.findById(userId)
            delete user.password
            r.json({ message: 'Perfil actualizado correctamente', data: user })

        } catch (error) {

            r.status(500).json({ message: error.message })

        }
    }

}

export default AuthoController
