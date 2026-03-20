import { 
    crear, 
    obtenerTodos, 
    obtenerPorId, 
    actualizar, 
    actualizarEstado, 
    eliminar, 
    asignarUsuarios, 
    obtenerUsuariosAsignados, 
    removerUsuario, 
    filtrarTareasModel 
} from '../models/tasks.module.js'; // Importación de todas las funciones necesarias desde el modelo de tareas para interactuar con los datos

export function crearTarea(req, res) { // Función para crear una nueva tarea en el sistema
    try { // Bloque para capturar errores durante la creación
        let datos = req.body; // Obtiene la información de la tarea desde el cuerpo de la solicitud
        let resultado = crear(datos); // Llama al modelo para guardar la nueva tarea
        res.status(201).json({ // Responde con éxito (creado) y los datos de la tarea
            mensaje: "Tarea creada con éxito", // Confirmación para el usuario
            data: resultado // Datos de la tarea recién creada
        }); // Cierra la respuesta
    } catch (error) { // Si ocurre un error lo captura aquí
        res.status(500).json({ // Envía un error 500 al cliente
            mensaje: "Error en el servidor", // Mensaje de aviso de error
            error: error.message // Detalles del fallo ocurrido
        }); // Finaliza la respuesta de error
    } // Fin del bloque catch
} // Fin de crearTarea

export function obtenerTodasLasTareas(req, res) { // Función para listar todas las tareas existentes
    try { // Intenta realizar la consulta a la base de datos (o modelo)
        let datos = obtenerTodos(); // Recupera el arreglo de todas las tareas del modelo
        res.status(200).json({ // Envía respuesta exitosa con los datos encontrados
            mensaje: "Consulta de todas las tareas", // Descripción de la acción realizada
            total: datos.length, // Indica la cantidad total de tareas encontradas
            data: datos // Arreglo con la información de las tareas
        }); // Cierra la respuesta exitosa
    } catch (error) { // Captura fallos en la consulta
        res.status(500).json({ // Responde con error de servidor
            mensaje: "Error en el servidor", // Mensaje Genérico
            error: error.message // Descripción detallada del error
        }); // Finaliza la respuesta
    } // Fin del bloque catch
} // Fin de obtenerTodasLasTareas

export function obtenerTareaPorId(req, res) { // Función para buscar una tarea específica mediante su ID
    try { // Inicio del control de errores
        let id = req.params.id; // Extrae el ID de la tarea desde los parámetros de la URL
        let datos = obtenerPorId(id); // Solicita al modelo la tarea que coincida con ese ID
        res.status(200).json({ // Envía la respuesta con la tarea encontrada
            mensaje: "Consulta por ID, ¡Exitosa!", // Mensaje de éxito
            data: datos // Información de la tarea consultada
        }); // Finaliza la respuesta
    } catch (error) { // Captura errores si el ID no existe o hay fallos
        res.status(500).json({ // Error interno del servidor
            mensaje: "Error en el servidor", // Mensaje de aviso
            error: error.message // Mensaje de error técnico
        }); // Cierra error
    } // Fin del bloque catch
} // Fin de obtenerTareaPorId

export function actualizarTarea(req, res) { // Función para modificar los datos de una tarea existente
    try { // Intenta aplicar los cambios
        let id = req.params.id; // Obtiene el ID de la tarea a modificar de la URL
        let datos = req.body; // Toma los nuevos datos del cuerpo de la solicitud
        let resultado = actualizar(id, datos); // Ejecuta la actualización en el modelo
        res.status(200).json({ // Responde confirmando el éxito de la operación
            mensaje: "Tarea actualizada con éxito", // Mensaje para el cliente
            data: resultado // Muestra cómo quedó la tarea tras los cambios
        }); // Cierra la respuesta satisfactoria
    } catch (error) { // Maneja problemas durante la actualización
        res.status(500).json({ // Responde con error 500
            mensaje: "Error en el servidor", // Aviso de error
            error: error.message // Detalle del error
        }); // Finaliza respuesta fallida
    } // Fin del bloque catch
} // Fin de actualizarTarea

export function eliminarTarea(req, res) { // Función para borrar definitivamente una tarea por su ID
    try { // Inicio de la lógica de eliminación
        let id = req.params.id; // Lee el identificador de la tarea desde la ruta
        eliminar(id); // Ordena al modelo que remueva la tarea correspondiente
        res.status(200).json({ // Envía confirmación de que se eliminó correctamente
            mensaje: "Tarea eliminada con éxito" // Texto informativo para el usuario
        }); // Cierra respuesta exitosa
    } catch (error) { // Si algo falla al borrar...
        res.status(500).json({ // Informa sobre el error de servidor
            mensaje: "Error en el servidor", // Título del error
            error: error.message // Contenido del error
        }); // Finaliza respuesta
    } // Fin del bloque catch
} // Fin de eliminarTarea

export function cambiarEstadoTarea(req, res) { // Función para actualizar exclusivamente el estado (status) de una tarea
    try { // Intenta cambiar el estado
        let id = req.params.id; // Identifica la tarea a través de su ID en la URL
        let { estado } = req.body; // Obtiene el nuevo valor del estado del cuerpo de la petición
        let resultado = actualizarEstado(id, estado); // Llama al modelo para que actualice solo el campo de estado
        res.status(200).json({ // Envía respuesta con el nuevo estado aplicado
            mensaje: "Estado actualizado con éxito", // Mensaje de éxito específico
            data: resultado // Datos de la tarea actualizada
        }); // Cierra la sesión de respuesta
    } catch (error) { // Manejo de excepciones
        res.status(500).json({ // Error de servidor
            mensaje: "Error en el servidor", // Mensaje estándar
            error: error.message // Detalle técnico
        }); // Fin de respuesta de error
    } // Fin del bloque catch
} // Fin de cambiarEstadoTarea

export function asignarTarea(req, res) { // Función para asignar uno o varios usuarios a una tarea determinada
    try { // Inicia bloque de asignación
        let tareaId = req.params.taskId; // Obtiene el ID de la tarea desde los parámetros de ruta
        let { usuarioIds } = req.body; // Lee el listado de IDs de usuario del cuerpo de la solicitud
        let resultado = asignarUsuarios(tareaId, usuarioIds); // Ejecuta la vinculación en el modelo
        res.status(200).json({ // Responde con éxito tras asignar
            mensaje: "Usuarios asignados con éxito", // Confirmación al usuario
            data: resultado // Muestra la relación tarea-usuario actualizada
        }); // Fin de respuesta
    } catch (error) { // Si algo sale mal en la asignación
        res.status(500).json({ // Reporta error 500
            mensaje: "Error en el servidor", // Mensaje clave
            error: error.message // Razón del fallo
        }); // Cierra el flujo de respuesta de error
    } // Fin del bloque catch
} // Fin de asignarTarea

export function obtenerUsuariosDeTarea(req, res) { // Función para ver quiénes están trabajando en una tarea
    try { // Intenta obtener el listado de usuarios
        let tareaId = req.params.taskId; // Identifica la tarea por su ID en los parámetros
        let usuarios = obtenerUsuariosAsignados(tareaId); // Pide al modelo los usuarios relacionados a esa tarea
        res.status(200).json({ // Envía el listado de usuarios vinculados
            mensaje: `Usuarios asignados a la tarea ${tareaId}`, // Texto dinámico informativo
            total: usuarios.length, // Conteo de personas asignadas
            data: usuarios // Lista detallada de usuarios
        }); // Cierra respuesta exitosa
    } catch (error) { // Errores en la consulta de asignaciones
        res.status(500).json({ // Respuesta de error interno
            mensaje: "Error en el servidor", // Mensaje base
            error: error.message // Info complementaria del error
        }); // Cierra flujo de error
    } // Fin del bloque catch
} // Fin de obtenerUsuariosDeTarea

export function removerUsuarioDeTarea(req, res) { // Función para quitar a un usuario de su asignación en una tarea
    try { // Iniciar proceso de remoción
        let { taskId, userId } = req.params; // Extrae tanto el ID de la tarea como el del usuario de la URL
        removerUsuario(taskId, userId); // Pide al modelo romper la vinculación entre ambos parámetros
        res.status(200).json({ // Confirmación de remoción completada
            mensaje: `Usuario ${userId} removido de la tarea ${taskId} con éxito` // Mensaje de éxito claro
        }); // Fin de respuesta
    } catch (error) { // Manejo de fallos al desvincular
        res.status(500).json({ // Respuesta fallida 500
            mensaje: "Error en el servidor", // Aviso genérico
            error: error.message // Info técnica
        }); // Cierra el bloque de error
    } // Fin del bloque catch
} // Fin de removerUsuarioDeTarea

export function filtrarTareas(req, res) { // Función para buscar tareas aplicando múltiples filtros dinámicos (estado, prioridad, etc.)
    try { // Ejecución de búsqueda filtrada
        let { estado, prioridad, usuarioId, fechaInicio, fechaFin } = req.query; // Recupera los criterios de búsqueda de la cadena de consulta (query string)
        let datos = filtrarTareasModel({ status: estado, priority: prioridad, userId: usuarioId, startDate: fechaInicio, endDate: fechaFin }); // Llama al buscador del modelo con los parámetros recibidos
        res.status(200).json({ // Devuelve los resultados parciales que coincidan
            mensaje: "Filtro aplicado con éxito", // Mensaje de confirmación del filtro
            total: datos.length, // Número de coincidencias encontradas
            data: datos // Detalle de las tareas que cumplen los requisitos
        }); // Fin de respuesta exitosa
    } catch (error) { // Si algo falla en la lógica de filtrado...
        res.status(500).json({ // Error de servidor por parámetros incorrectos o fallos de lógica
            mensaje: "Error en el servidor", // Título común
            error: error.message // Mensaje de error para debug
        }); // Cierra respuesta de error
    } // Fin del bloque catch
} // Fin de filtrarTareas