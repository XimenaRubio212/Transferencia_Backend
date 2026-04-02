import {
    crear,
    obtenerTodos,
    obtenerPorId,
    obtenerPorEmail,
    actualizar,
    actualizarEstado,
    eliminar,
    obtenerTareasPorUsuario
} from '../models/user.module.js'; // Importa las funciones CRUD y de consulta desde el modelo de usuarios

export async function crearUsuario(req, res) { // Función para registrar un nuevo usuario en la base de datos
    try { // Inicia bloque de seguridad para el manejo de excepciones
        let datos = req.body; // Recupera la información del usuario desde el cuerpo del mensaje HTTP

        if (!datos.nombre || !datos.email) { // Verifica que el nombre y el correo electrónico no estén vacíos
            return res.status(400).json({ // Retorna un error de "Solicitud Incorrecta" si faltan campos
                mensaje: "Los campos 'nombre' y 'email' son obligatorios" // Explica al cliente qué campos faltan
            }); // Termina la respuesta con error de validación
        } // Fin del chequeo de campos obligatorios

        let usuarioExistente = await obtenerPorEmail(datos.email); // Busca en el modelo si ya hay alguien registrado con ese email
        if (usuarioExistente) { // Si se encuentra un registro previo con el mismo correo...
            return res.status(409).json({ // Devuelve un error 409 indicando un conflicto de datos duplicados
                mensaje: "Ya existe un usuario con ese email" // Informa sobre la duplicidad del correo
            }); // Finaliza la respuesta de conflicto
        } // Fin de la validación de correo único

        let rolesPermitidos = ["admin", "user"]; // Define una lista blanca de roles aceptados por el sistema
        if (datos.rol && !rolesPermitidos.includes(datos.rol)) { // Si se envía un rol, valida que esté en la lista blanca
            return res.status(400).json({ // Reporta error 400 por valor de rol no permitido
                mensaje: `El rol debe ser: ${rolesPermitidos.join(" o ")}` // Indica cuáles son los únicos roles válidos
            }); // Cierra la respuesta de error de rol
        } // Fin de validación de roles

        let resultado = await crear(datos); // Procede a crear el usuario llamando a la lógica del modelo
        res.status(201).json({ // Envía respuesta con código 201 (Creado) al finalizar con éxito
            mensaje: "Usuario creado con éxito", // Confirmación amigable para el frontend
            data: resultado // Adjunta el objeto del usuario recién creado
        }); // Finaliza proceso de creación exitosa
    } catch (error) { // Captura fallos imprevistos o errores lógicos internos
        res.status(500).json({ // Devuelve código 500 para errores generales del lado del servidor
            mensaje: "Error en el servidor", // Mensaje estándar de fallo técnico
            error: error.message // Incluye la descripción técnica del error para depuración
        }); // Cierra la respuesta de error de servidor
    } // Fin del bloque catch
} // Fin de crearUsuario

export async function obtenerTodosLosUsuarios(req, res) { // Función para listar todos los usuarios registrados
    try { // Intenta recuperar la lista completa
        let datos = await obtenerTodos(); // Llama al modelo para obtener el arreglo de usuarios
        res.status(200).json({ // Responde con éxito y los datos obtenidos
            mensaje: "Consulta de todos los usuarios", // Título de la operación
            total: datos.length, // Indica cuántos registros se encontraron en total
            data: datos // Arreglo con la información de cada usuario
        }); // Cierra respuesta satisfactoria
    } catch (error) { // Maneja errores de lectura o procesamiento
        res.status(500).json({ // Responde con error interno del servidor
            mensaje: "Error en el servidor", // Aviso de fallo
            error: error.message // Detalles del error ocurrido
        }); // Fin de respuesta fallida
    } // Fin del bloque catch
} // Fin de obtenerTodosLosUsuarios

export async function obtenerUsuarioPorId(req, res) { // Función para buscar un usuario específico por su identificador numérico
    try { // Proceso de búsqueda controlada
        let id = req.params.id; // Lee el ID de los parámetros de la ruta (URL)
        let datos = await obtenerPorId(id); // Consulta al modelo por el registro correspondiente a ese ID

        if (!datos) { // Si el modelo devuelve nulo o indefinido (no se encontró)
            return res.status(404).json({ // Responde con el estándar 404 (No Encontrado)
                mensaje: `No se encontró ningún usuario con ID ${id}` // Mensaje personalizado con el ID buscado
            }); // Finaliza respuesta de búsqueda fallida
        } // Fin de validación de existencia

        res.status(200).json({ // Si existe, responde con éxito
            mensaje: "Consulta por ID, ¡Exitosa!", // Grito de éxito para la consulta
            data: datos // Información completa del usuario encontrado
        }); // Fin de respuesta exitosa
    } catch (error) { // Captura incidentes en la búsqueda
        res.status(500).json({ // Reporta error severo de servidor
            mensaje: "Error en el servidor", // Encabezado de error
            error: error.message // Detalle del problema
        }); // Cierra el flujo de error
    } // Fin del bloque catch
} // Fin de obtenerUsuarioPorId

export async function actualizarUsuario(req, res) { // Función para modificar datos de un perfil de usuario existente
    try { // Intento de actualización de datos
        let id = req.params.id; // Localiza al usuario por su ID en la URL
        let datos = req.body; // Obtiene los campos a actualizar del cuerpo de la petición

        let usuarioExistente = await obtenerPorId(id); // Valida primero si el usuario a editar realmente existe
        if (!usuarioExistente) { // Si no existe el usuario...
            return res.status(404).json({ // Devuelve error 404
                mensaje: `No se encontró ningún usuario con ID ${id}` // Explica que no se puede editar lo que no existe
            }); // Cierra respuesta de error
        } // Fin de validación pre-edición

        if (datos.email) { // Si el usuario intenta cambiar su correo...
            let usuarioConEmail = await obtenerPorEmail(datos.email); // Verifica si el nuevo correo ya le pertenece a alguien más
            if (usuarioConEmail && usuarioConEmail.id != id) { // Si el correo existe y no es del usuario actual...
                return res.status(409).json({ // Rebota la petición por conflicto de email duplicado
                    mensaje: "Ese email ya está en uso por otro usuario" // Mensaje de aviso de duplicidad
                }); // Cierra flujo de conflicto
            } // Fin de chequeo de email duplicado en edición
        } // Fin de validación de email opcional

        let rolesPermitidos = ["admin", "user"]; // Reafirma los roles permitidos en el sistema
        if (datos.rol && !rolesPermitidos.includes(datos.rol)) { // Valida si el nuevo rol es legal
            return res.status(400).json({ // Error 400 por rol inválido
                mensaje: `El rol debe ser: ${rolesPermitidos.join(" o ")}` // Lista los roles permitidos una vez más
            }); // Termina respuesta de error
        } // Fin de validación de rol en edición

        let resultado = await actualizar(id, datos); // Ejecuta los cambios guardándolos en el modelo
        res.status(200).json({ // Responde con confirmación de éxito
            mensaje: "Usuario actualizado con éxito", // Mensaje positivo para el cliente
            data: resultado // Muestra el estado final del usuario tras la actualización
        }); // Finaliza respuesta de actualización exitosa
    } catch (error) { // Recoge fallos de procesamiento
        res.status(500).json({ // Error genérico de servidor
            mensaje: "Error en el servidor", // Título informativo
            error: error.message // Info técnica relevante
        }); // Fin de respuesta fallida
    } // Fin del bloque catch
} // Fin de actualizarUsuario

export async function eliminarUsuario(req, res) { // Función para remover un usuario del sistema permanentemente
    try { // Lógica de borrado segura
        let id = req.params.id; // Identifica al objetivo mediante el ID en la ruta
        let eliminado = await eliminar(id); // Envía la instrucción de eliminación al modelo

        if (!eliminado) { // Si el modelo no pudo realizar el borrado (ej: ID inexistente)
            return res.status(404).json({ // Envía un 404 al cliente
                mensaje: `No se encontró ningún usuario con ID ${id}` // Explica que no hay nada que borrar con ese ID
            }); // Finaliza respuesta fallida
        } // Fin de chequeo de borrado realizado

        res.status(200).json({ // Si se borró con éxito...
            mensaje: "Usuario eliminado con éxito" // Informa al cliente del éxito total
        }); // Fin de flujo de borrado exitoso
    } catch (error) { // Control de daños por errores de servidor
        res.status(500).json({ // Responde error 500
            mensaje: "Error en el servidor", // Aviso de incidente
            error: error.message // Detalle del error atrapado
        }); // Cierra transmisión de error
    } // Fin del bloque catch
} // Fin de eliminarUsuario

export async function actualizarEstadoUsuario(req, res) { // Función para activar o desactivar una cuenta de usuario
    try { // Intento de cambio de estado (activo/inactivo)
        let id = req.params.id; // Lee el ID del usuario de la URL
        let { estado } = req.body; // Toma el nuevo estado del cuerpo del JSON enviado

        let estadosPermitidos = ["activo", "inactivo"]; // Solo se permiten estos dos estados lógicos
        if (!estado || !estadosPermitidos.includes(estado)) { // Valida que se envíe un estado y que este sea válido
            return res.status(400).json({ // Error 400 por estado mal especificado o ausente
                mensaje: `El campo 'estado' es obligatorio y debe ser: ${estadosPermitidos.join(" o ")}` // Instrucción correctiva
            }); // Cierra respuesta de error de validación
        } // Fin de validación de estados

        let resultado = await actualizarEstado(id, estado); // Ejecuta el cambio de estado en el modelo

        if (!resultado) { // Si no se encuentra al usuario para cambiarle el estado
            return res.status(404).json({ // Responde indicando que el usuario no existe
                mensaje: `No se encontró ningún usuario con ID ${id}` // Detalla la ausencia del usuario mediante su ID
            }); // Corta la ejecución con error
        } // Fin de comprobación de existencia

        res.status(200).json({ // Respuesta de éxito si el estado cambió correctamente
            mensaje: `Usuario ${estado === "activo" ? "activado" : "desactivado"} con éxito`, // Mensaje dinámico según el nuevo estado
            data: resultado // Muestra los datos actualizados del usuario
        }); // Fin de flujo exitoso
    } catch (error) { // Gestión de fallos inesperados
        res.status(500).json({ // Respuesta de fallo masivo
            mensaje: "Error en el servidor", // Aviso de avería en servidor
            error: error.message // Explicación técnica del suceso
        }); // Finaliza respuesta de error
    } // Fin del bloque catch
} // Fin de actualizarEstadoUsuario

export async function verTareasPorUsuario(req, res) { // Función para listar todas las tareas asociadas a un usuario específico
    try { // Inicia consulta de relación usuario-tareas
        let usuarioId = req.params.userId; // Toma el ID del usuario desde la ruta dinámica

        let usuario = await obtenerPorId(usuarioId); // Primero verifica si el usuario en cuestión existe legalmente
        if (!usuario) { // Si no existe el usuario solicitado...
            return res.status(404).json({ // Error 404 inmediato
                mensaje: `No se encontró ningún usuario con ID ${usuarioId}` // Informa que el usuario no está registrado
            }); // Finaliza petición fallida
        } // Fin de validación de pertenencia

        let tareas = await obtenerTareasPorUsuario(usuarioId); // Pide al modelo las tareas relacionadas con dicho usuario
        res.status(200).json({ // Responde con el listado de tareas vinculadas
            mensaje: `Tareas del usuario "${usuario.nombre || usuario.name}"`, // Referencia el nombre del usuario para mayor claridad
            total: tareas.length, // Indica cuántas tareas tiene bajo su responsabilidad
            data: tareas // Arreglo detallado con el contenido de cada tarea
        }); // Fin de flujo de consulta exitosa
    } catch (error) { // Atrapar errores durante la obtención de tareas
        res.status(500).json({ // Devuelve error crítico de servidor
            mensaje: "Error en el servidor", // Mensaje genérico de caída/fallo
            error: error.message // Descripción detallada del error lógico o de lectura
        }); // Finaliza respuesta de error interno
    } // Fin del bloque catch
} // Fin de verTareasPorUsuario