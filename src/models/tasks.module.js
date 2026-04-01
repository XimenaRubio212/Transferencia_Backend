import pool from '../config/db.js'; // Importa el acceso a la base de datos MySQL

// Función asíncrona para instanciar y guardar una nueva tarea en SQL
export async function crear(datos) {
    const { title, description, priority, dueDate, userId } = datos; // Extrae los campos de la tarea
    
    let finalUserId = (userId && userId !== "") ? userId : null; // Normaliza el ID de usuario a nulo si está vacío

    if (finalUserId) { // Si se proporciona un usuario, verificamos su existencia para evitar errores de clave foránea
        const [user] = await pool.query('SELECT id FROM users WHERE id = ?', [finalUserId]);
        if (user.length === 0) finalUserId = null; // Si el usuario no existe en la DB, lo desvinculamos permanentemente
    }

    const [result] = await pool.query( // Inserta la nueva tarea en la tabla 'tasks'
        'INSERT INTO tasks (title, description, priority, dueDate, userId) VALUES (?, ?, ?, ?, ?)',
        [title, description || "", priority || "medio", dueDate ? new Date(dueDate) : null, finalUserId]
    );
    return { id: result.insertId, ...datos }; // Retorna la tarea creada con su nuevo ID autoincremental
}

// Función asíncrona para recuperar el listado completo de tareas desde MySQL
export async function obtenerTodos() {
    const [rows] = await pool.query('SELECT * FROM tasks'); // Ejecuta la consulta de selección total
    return rows; // Retorna el arreglo de tareas
}

// Función asíncrona para localizar una tarea específica por su identificador único
export async function obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]); // Busca la tarea que coincida con el ID
    return rows[0] || null; // Retorna el objeto de la tarea o nulo si el ID no existe
}

// Función asíncrona para editar los campos de una tarea existente
export async function actualizar(id, datos) {
    const { title, description, priority, dueDate, userId } = datos; // Obtiene los nuevos valores

    let finalUserId = (userId && userId !== "") ? userId : undefined; // Mantiene el valor actual si no se envía nada

    if (finalUserId) { // Valida la existencia del usuario en caso de cambio de asignación
        const [user] = await pool.query('SELECT id FROM users WHERE id = ?', [finalUserId]);
        if (user.length === 0) finalUserId = null; // Resetea a nulo si el usuario indicado es inválido
    } else if (userId === null || userId === "") {
        finalUserId = null; // Permite desvincular explícitamente al usuario
    }
    
    await pool.query( // Actualiza los campos permitidos en la tabla 'tasks'
        'UPDATE tasks SET title=?, description=?, priority=?, dueDate=?, userId=? WHERE id=?',
        [title, description, priority, dueDate ? new Date(dueDate) : null, finalUserId, id]
    );
    return obtenerPorId(id); // Devuelve la tarea con los cambios aplicados
}

// Función asíncrona específica para cambiar únicamente el estado de una tarea
export async function actualizarEstado(id, estado) {
    await pool.query('UPDATE tasks SET estado=? WHERE id=?', [estado, id]); // Modifica el campo 'estado' en la DB
    return obtenerPorId(id); // Retorna la tarea actualizada
}

// Función asíncrona para remover definitivamente una tarea de la base de datos
export async function eliminar(id) {
    const [result] = await pool.query('DELETE FROM tasks WHERE id=?', [id]); // Ejecuta el comando DELETE
    return result.affectedRows > 0; // Confirma si la eliminación afectó a alguna fila (éxito)
}

// Función asíncrona para vincular múltiples usuarios a una tarea (Muchos a Muchos)
export async function asignarUsuarios(tareaId, usuarioIds) {
    const idsFinales = Array.isArray(usuarioIds) ? usuarioIds : [usuarioIds]; // Asegura que trabajamos con un arreglo
    for (const uid of idsFinales) { // Itera sobre cada usuario a asignar
        await pool.query( // Registra la relación en la tabla intermedia 'task_users' ignorando duplicados
            'INSERT IGNORE INTO task_users (task_id, user_id) VALUES (?, ?)',
            [tareaId, uid]
        );
    }
    return obtenerPorId(tareaId); // Retorna la tarea con sus nuevas asignaciones registradas
}

// Función asíncrona para consultar los IDs de los usuarios vinculados a una tarea
export async function obtenerUsuariosAsignados(tareaId) {
    const [rows] = await pool.query('SELECT user_id FROM task_users WHERE task_id = ?', [tareaId]); // Busca en la tabla intermedia
    return rows.map(r => r.user_id); // Retorna solo el listado plano de IDs de usuarios
}

// Función asíncrona para desvincular a un usuario específico de una tarea
export async function removerUsuario(tareaId, usuarioId) {
    const [result] = await pool.query( // Elimina el registro específico de la tabla intermedia
        'DELETE FROM task_users WHERE task_id = ? AND user_id = ?',
        [tareaId, usuarioId]
    );
    return result.affectedRows > 0; // Retorna verdadero si se rompió la vinculación exitosamente
}

// Función asíncrona para listar tareas donde un usuario específico es el creador/dueño
export async function obtenerTareasPorUsuario(userId) {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE userId=?', [userId]); // Filtra tareas por la clave userId
    return rows; // Retorna las tareas encontradas
}

// Función asíncrona de búsqueda avanzada con filtros SQL dinámicos
export async function filtrarTareasModel({ estado, prioridad, usuarioId }) {
    let query = 'SELECT * FROM tasks WHERE 1=1'; // Inicializa la consulta base (1=1 facilita el agregado de condiciones)
    const params = []; // Arreglo para manejar los parámetros de forma segura

    if (estado !== undefined && estado !== null) { // Agrega filtro de estado si está presente
        query += ' AND estado = ?';
        params.push(estado);
    }
    if (prioridad !== undefined && prioridad !== null) { // Agrega filtro de prioridad si se recibe
        query += ' AND priority = ?';
        params.push(prioridad);
    }
    if (usuarioId !== undefined && usuarioId !== null) { // Filtra tareas vinculadas al usuario indicado
        query += ' AND userId = ?';
        params.push(usuarioId);
    }

    const [rows] = await pool.query(query, params); // Ejecuta la consulta dinámicamente construida
    return rows; // Retorna el conjunto de tareas filtradas
}