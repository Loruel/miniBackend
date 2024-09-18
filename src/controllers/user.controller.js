import User from "../models/user.js"

class UserController {

    static async store(q, r) {
        try {
            console.log(q.body)
            const { nombre, descripcion, correo, telefono, contraseña, foto } = q.body
            if (!correo || !contraseña) {
                return r.status(400).json({ message: 'Datos incompletos' })
            }

            const encriptadaPassword = await bcrypt.hash(contraseña, 10)

            const user = await User.create({
                nombre,
                descripcion,
                correo,
                telefono,
                contraseña: encriptadaPassword,
                foto
            })

            r.status(201).json({ message: 'Usuario creado satisfactoriamente', data: user })

        } catch (error) {
            r.status(500).json({ message: error.message })
        }
    }

    static async updatePatch(q, r) {
        try {

            const { id } = q.params
            const {
                nombre,
                descripcion,
                correo,
                telefono,
                contraseña,
                foto
            } = q.body

            const resultado = await User.update({
                usuario: id,
                nombre,
                descripcion,
                correo,
                telefono,
                contraseña,
                foto
            })

            if (!resultado) return r.status(400).json({ message: 'No existen datos que actualizar' })

            if (resultado.affectedRows === 0) return r.status(400).json({ message: 'No se pudo actualizar el usuario' })

            const user = await User.findById(id)
            delete user.password
            r.json({ message: 'Usuario actualizado satisfactoriamente', data: user })

        } catch (error) {

            r.status(500).json({ message: error.message })

        }
    }

    static async getByID(q, r) {
        try {
            if (q.user) {
                delete q.user.password
                r.json(q.user)
            } else {
                r.status(404).json({message: 'Usuario no encontrado'})
            }
        } catch (error) {
            r.status(500).json({ message: error.message })
        }
    }

    static async index(q, r) {
        try {

            const users = await User.all()
            r.json(users)

        } catch (error) {

            r.status(500).json({ message: error.message })

        }
    }

}

export default UserController