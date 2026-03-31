//se importa el modelo de tareas para poder obtenelas por usuario
import { obtenerTareasPorUsuario as obtenerTareasDesdeModeloTareas } from './tasks.module.js';

let usuarios = []; // Arreglo en memoria diseñado para almacenar la colección de usuarios (simulación de DB)
let contadorId = 1; // Contador autoincremental destinado a generar los IDs únicos de los usuarios

export function crear(datos) { // Función encargada de instanciar y registrar un nuevo usuario
    let nuevoUsuario = { // Define la estructura base de un nuevo registro de usuario
        id: contadorId++, // Asigna el valor del ID actual e incrementa el contador global
        fechaCreacion: new Date(), // Genera la marca de tiempo de la creación del registro
        rol: "user", // Establece por defecto el rol de "usuario estándar"
        estado: "active", // Define el estado inicial de la cuenta como "activa"
        ...datos, // Copia y expande el resto de propiedades recibidas en el objeto de datos
    }; // Fin de la definición del nuevo usuario
    usuarios.push(nuevoUsuario); // Incorpora el nuevo objeto al arreglo de usuarios
    return nuevoUsuario; // Retorna el usuario creado para su visualización o confirmación
} // Fin de la función crear

export function obtenerTodos() { // Función para recuperar la totalidad de los usuarios registrados
    return usuarios; // Retorna el arreglo completo de la colección de usuarios
} // Fin de obtenerTodos

export function obtenerPorId(id) { // Función para localizar a un usuario mediante su identificador único ID
    return usuarios.find(u => u.id == id); // Busca y devuelve el usuario cuya propiedad id coincida con la proporcionada
} // Fin de obtenerPorId

export function obtenerPorEmail(email) { // Función para buscar un usuario a través de su correo electrónico
    return usuarios.find(u => u.email === email); // Retorna el usuario que posea el email exacto que se ha solicitado
} // Fin de obtenerPorEmail

export function actualizar(id, nuevosDatos) { // Función para modificar las propiedades de un usuario existente
    let usuario = obtenerPorId(id); // Intenta encontrar al usuario objetivo mediante su ID
    if (usuario) { // Si el usuario es localizado con éxito...
        Object.assign(usuario, nuevosDatos); // Sobrescribe las propiedades existentes con los nuevos valores recibidos
        return usuario; // Retorna el objeto del usuario con los cambios ya aplicados
    } // Fin del bloque si existe el usuario
    return null; // Retorna nulo si no se encontró nadie con ese ID
} // Fin de actualizar

export function actualizarEstado(id, estado) { // Función específica para cambiar el estado de activación de un usuario
    let usuario = obtenerPorId(id); // Localiza al usuario requerido
    if (usuario) { // Si se encuentra el usuario...
        usuario.estado = estado; // Actualiza únicamente el campo de estado
        return usuario; // Retorna el usuario con su nuevo estado de cuenta
    } // Fin del bloque si existe el usuario
    return null; // Retorna nulo si el usuario no existe en los registros
} // Fin de actualizarEstado

export function eliminar(id) { // Función diseñada para dar de baja definitiva a un usuario de los registros
    let indice = usuarios.findIndex(u => u.id == id); // Busca el índice de la posición del usuario en el arreglo
    if (indice !== -1) { // Si el usuario se encuentra presente en la lista...
        usuarios.splice(indice, 1); // Remueve la entrada del usuario del arreglo basándose en su posición
        return true; // Confirma que la operación de eliminación fue exitosa
    } // Fin del bloque si el usuario fue encontrado
    return false; // Indica que la eliminación falló al no encontrarse el ID especificado
} // Fin de eliminar

export function obtenerTareasPorUsuario(usuarioId) { // Función puente para obtener las tareas vinculadas a un usuario
    // Esta función debería interactuar con el modelo de tareas para filtrar las asignaciones
    return obtenerTareasDesdeModeloTareas(usuarioId); // Retorna el llamado al método que recupera las tareas del usuario
} // Fin de obtenerTareasPorUsuario (Requiere implementación de la fuente de datos de tareas)