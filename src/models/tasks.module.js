let tareas = []; // Arreglo en memoria para almacenar todas las tareas (simulación de base de datos)
let contadorId = 1; // Contador autoincremental para asignar IDs únicos a cada nueva tarea

export function crear(datos) { // Función para instanciar y guardar una nueva tarea
    let nuevaTarea = { // Definición de la estructura del objeto de tarea
        id: contadorId++, // Asigna el ID actual e incrementa el contador para la siguiente tarea
        titulo: datos.title, // Título de la tarea obtenido de los datos de entrada
        descripcion: datos.description || "", // Descripción opcional (vacía por defecto)
        estado: "pending", // Estado inicial de cualquier tarea nueva: "pendiente"
        prioridad: datos.priority || "medio", // Nivel de prioridad (medio por defecto)
        assignedUsers: datos.assignedUsers || [], // Lista de IDs de usuarios asignados a esta tarea
        fechaCreacion: new Date(), // Registra la fecha y hora exacta de creación
        fechaVencimiento: datos.dueDate ? new Date(datos.dueDate) : null, // Convierte la fecha de vencimiento a objeto Date o nulo
        usuarioId: datos.userId || null, // ID del usuario creador o responsable principal
    }; // Fin de la definición del objeto nuevaTarea
    tareas.push(nuevaTarea); // Agrega la tarea recién creada al arreglo principal
    return nuevaTarea; // Devuelve el objeto de la tarea creada para confirmación
} // Fin de la función crear

export function obtenerTodos() { // Función para recuperar el listado completo de tareas
    return tareas; // Retorna el arreglo con todas las tareas existentes
} // Fin de obtenerTodos

export function obtenerPorId(id) { // Función para localizar una tarea específica por su ID
    return tareas.find(t => t.id == id); // Busca y retorna la tarea cuyo ID coincida con el parámetro
} // Fin de obtenerPorId

export function actualizar(id, nuevosDatos) { // Función para editar una tarea existente
    let tarea = obtenerPorId(id); // Primero intenta encontrar la tarea por su ID
    if (tarea) { // Si la tarea existe...
        let { estado, assignedUsers, fechaCreacion, ...datosSeguros } = nuevosDatos; // Extrae datos sensibles que no deben editarse masivamente
        Object.assign(tarea, datosSeguros); // Aplica los nuevos datos permitidos al objeto de la tarea original
        if (nuevosDatos.dueDate) tarea.fechaVencimiento = new Date(nuevosDatos.dueDate); // Actualiza la fecha de vencimiento si se proporciona una nueva
        return tarea; // Retorna el objeto de la tarea actualizado
    } // Fin del bloque si la tarea existe
    return null; // Si no se encuentra la tarea, retorna nulo
} // Fin de actualizar

export function actualizarEstado(id, estado) { // Función específica para cambiar únicamente el estado de una tarea
    let tarea = obtenerPorId(id); // Busca la tarea objetivo
    if (tarea) { // Si la encuentra...
        tarea.estado = estado; // Cambia el valor del campo estado por el nuevo valor recibido
        return tarea; // Retorna la tarea con el nuevo estado
    } // Fin del bloque si existe la tarea
    return null; // Retorna nulo si no se localiza la tarea
} // Fin de actualizarEstado

export function eliminar(id) { // Función para remover una tarea del arreglo permanente
    let indice = tareas.findIndex(t => t.id == id); // Localiza la posición de la tarea en el arreglo
    if (indice !== -1) { // Si la tarea se encuentra en la lista...
        tareas.splice(indice, 1); // Remueve un elemento en la posición encontrada
        return true; // Indica que la eliminación fue exitosa
    } // Fin del bloque si se encuentra
    return false; // Indica que no se pudo eliminar (ID no encontrado)
} // Fin de eliminar

export function asignarUsuarios(tareaId, usuarioIds) { // Función para vincular múltiples usuarios a una tarea
    let tarea = obtenerPorId(tareaId); // Obtiene la tarea por su ID
    if (!tarea) return null; // Si no existe la tarea, termina retornando nulo

    usuarioIds.forEach(uid => { // Itera sobre cada ID de usuario recibido
        if (!tarea.assignedUsers.includes(uid)) { // Verifica si el usuario ya está asignado para evitar duplicados
            tarea.assignedUsers.push(uid); // Agrega el ID del usuario a la lista de asignados de la tarea
        } // Fin de la verificación de duplicados
    }); // Fin del bucle forEach
    return tarea; // Retorna la tarea con la nueva lista de usuarios vinculados
} // Fin de asignarUsuarios

export function obtenerUsuariosAsignados(tareaId) { // Función para consultar quiénes están asignados a una tarea
    let tarea = obtenerPorId(tareaId); // Busca la tarea correspondiente
    if (!tarea) return null; // Retorna nulo si la tarea no existe
    return tarea.assignedUsers; // Retorna el arreglo de IDs de usuarios asignados
} // Fin de obtenerUsuariosAsignados

export function removerUsuario(tareaId, usuarioId) { // Función para desvincular a un usuario específico de una tarea
    let tarea = obtenerPorId(tareaId); // Obtiene la tarea objetivo
    if (!tarea) return null; // Termina si la tarea no se encuentra

    let indice = tarea.assignedUsers.findIndex(uid => uid == usuarioId); // Busca la posición del usuario en el arreglo de asignaciones
    if (indice === -1) return false; // Retorna falso si el usuario no estaba asignado a esa tarea

    tarea.assignedUsers.splice(indice, 1); // Quita al usuario de la lista de asignados
    return true; // Confirma que la remoción fue exitosa
} // Fin de removerUsuario

export function filtrarTareasModel({ estado, prioridad, usuarioId, fechaInicio, fechaFin }) { // Función de búsqueda avanzada con filtros múltiples
    let resultado = [...tareas]; // Crea una copia de la lista de tareas para no afectar la original durante el filtrado

    if (estado)      resultado = resultado.filter(t => t.estado === estado); // Filtra por estado si se proporciona el parámetro
    if (prioridad)   resultado = resultado.filter(t => t.prioridad === prioridad); // Filtra por prioridad si se recibe el valor
    if (usuarioId)   resultado = resultado.filter(t => t.assignedUsers.includes(Number(usuarioId))); // Filtra tareas donde el usuario está asignado
    if (fechaInicio) resultado = resultado.filter(t => t.fechaCreacion >= new Date(fechaInicio)); // Filtra por fecha de creación mínima
    if (fechaFin)    resultado = resultado.filter(t => t.fechaCreacion <= new Date(fechaFin)); // Filtra por fecha de creación máxima

    return resultado; // Retorna la lista de tareas que cumplen con todos los criterios aplicados
} // Fin de filtrarTareasModel

export function obtenerTareasPorUsuario(usuarioId) { // Función para listar tareas creadas por un usuario específico
    return tareas.filter(t => t.usuarioId == usuarioId); // Retorna las tareas cuyo usuarioId coincida con el solicitado
} // Fin de obtenerTareasPorUsuario