import { pool } from "../config/db.js"
import bcrypt from "bcrypt"

class User {

    static async all() {
        const [users] = await pool.execute(
            'SELECT user_id, name, bio, email, phone, photo FROM users'
        )
        return users
    }

    static async findById(id) {
        const [user] = await pool.execute(
            'SELECT user_id, name, bio, email, phone, password, photo FROM users WHERE user_id = ?',
            [id]
        )
        return user[0]
    }


    static async findOne(columna, valor) {
        const [user] = await pool.execute(
            `SELECT user_id, name, bio, email, phone, password, photo FROM users WHERE ${columna} = ?`,
            [valor]
        )
        return user[0]
    }


    static async create({
        nombre,
        descripcion,
        correo,
        telefono,
        contraseña,
        foto
    }) {
        const camposObligatorios = [
            'email',
            'password'
        ]
        const encriptada = await bcrypt.hash(contraseña, 10)
        const datosGuardar = [correo, encriptada]

        if (nombre) {
            camposObligatorios.push('name')
            datosGuardar.push(nombre)
        }

        if (descripcion) {
            camposObligatorios.push('bio')
            datosGuardar.push(descripcion)
        }

        if (telefono) {
            camposObligatorios.push('phone')
            datosGuardar.push(telefono)
        }

        if (foto) {
            camposObligatorios.push('photo')
            datosGuardar.push(foto)
        }

        const stringCamposObligatorios = camposObligatorios.join(', ')
        const placeholders = camposObligatorios.map(() => '?').join(', ')

        const query = `INSERT INTO users(${stringCamposObligatorios}) VALUES (${placeholders})`
        const [resultado] = await pool.execute(query, datosGuardar)
        const user = await this.findById(resultado.insertId)

        delete user.password

        return user
    }


    static async update({
        usuario,
        nombre,
        descripcion,
        correo,
        telefono,
        contraseña,
        foto
    }) {

        let query = 'UPDATE users SET '
        const camposActualizar = []
        const valoresActualizar = []

        if(nombre){
            camposActualizar.push('name = ?')
            valoresActualizar.push(nombre)
        }

        if(descripcion){
            camposActualizar.push('bio = ?')
            valoresActualizar.push(descripcion)
        }

        if(correo){
            camposActualizar.push('email = ?')
            valoresActualizar.push(correo)
        }

        if(telefono){
            camposActualizar.push('phone = ?')
            valoresActualizar.push(telefono)
        }

        if(contraseña){
            camposActualizar.push('password = ?')
            const encriptada = await bcrypt.hash(contraseña, 10)
            valoresActualizar.push(encriptada)
        }

        if(foto){
            camposActualizar.push('photo = ?')
            valoresActualizar.push(foto)
        }

        if (camposActualizar.length === 0) return undefined

        query += camposActualizar.join(', ') + ' WHERE user_id = ?'
        valoresActualizar.push(usuario)

        const[resultado] = await pool.execute(query, valoresActualizar)
        return resultado
    }
}

export default User