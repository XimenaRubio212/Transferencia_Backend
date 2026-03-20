import { buscarPorEmail, generarToken } from '../models/auth.module.js'; // Importa funciones de búsqueda y generación de token desde el modelo de autenticación

export function login(req, res) { // Define y exporta la función para manejar el inicio de sesión
    try { // Inicia un bloque try para capturar posibles errores durante el login
        let { email, password } = req.body; // Extrae el email y el password enviados en el cuerpo de la solicitud
        let usuario = buscarPorEmail(email); // Llama a la función del modelo para buscar al usuario por su email

        if (!usuario || usuario.password !== password) { // Comprueba si el usuario existe y si la contraseña es correcta
            return res.status(404).json({ // Si falla la validación, devuelve un estado 404 (No encontrado)
                mensaje: "Credenciales incorrectas" // Envía un mensaje indicando que las credenciales no son válidas
            }); // Cierra el objeto de respuesta de error
        } // Fin de la validación de usuario y contraseña

        let token = generarToken(usuario); // Genera un token de acceso para el usuario que se ha autenticado con éxito
        res.status(201).json({ // Devuelve un estado 201 (Creado) indicando un inicio de sesión exitoso
            mensaje: "Inicio de sesión exitoso", // Envía un mensaje de confirmación al cliente
            data: { // Inicia el objeto que contendrá la información del usuario y su token
                token, // Incluye el token generado en la respuesta
                usuario: { // Envía datos limitados del usuario para mayor seguridad
                    id:    usuario.id, // Incluye el identificador único del usuario
                    email: usuario.email, // Incluye la dirección de correo electrónico del usuario
                    role:  usuario.role, // Incluye el rol o nivel de permisos del usuario
                } // Cierra el objeto de datos del usuario
            } // Cierra el objeto principal de datos
        }); // Finaliza el envío de la respuesta exitosa al cliente
    } catch (error) { // Captura cualquier error que ocurra dentro del bloque try
        res.status(500).json({ // Devuelve un estado 500 (Error interno del servidor)
            mensaje: "Error en el servidor", // Informa al cliente que hubo un fallo general en el servidor
            error: error.message // Adjunta el mensaje específico del error capturado
        }); // Cierra la respuesta de error del servidor
    } // Fin del bloque catch
} // Cierra la función controladora de login