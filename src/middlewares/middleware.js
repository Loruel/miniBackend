import { allowedOrigins } from "../config/config.js"

export const validateCORS = (q, r, next) => {
    try {

        const {origin} = q.headers
        console.log(origin)

        if (allowedOrigins.includes(origin)){
            r.setHeader('Access-Control-Allow-Origin', origin || '*')
            r.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            r.setHeader('Access-Control-Allow-Headers', 'content-type, authorization')
            next()
        } else {
            r.status(403).json({message: 'No permitido por CORS'})
        }

    } catch (error) {

        r.status(500).json({ message: error.message })

    }
}