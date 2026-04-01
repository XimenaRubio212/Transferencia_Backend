import pool from '../config/db.js'; // Importa el acceso a la base de datos MySQL

// Función asíncrona para guardar una nueva tarea en SQL
export async function crear(datos) {
    const { title, description, priority, dueDate, userId } = datos;
    
    let finalUserId = (userId && userId !== "") ? userId : null;

    if (finalUserId) { // Verifica existencia del usuario
        const [user] = await pool.query('SELECT id FROM users WHERE id = ?', [finalUserId]);
        if (user.length === 0) finalUserId = null;
    }

    const [result] = await pool.query( // Inserta según el esquema definitivo
        'INSERT INTO tasks (title, description, priority, dueDate, userId) VALUES (?, ?, ?, ?, ?)',
        [title, description || "", priority || "medio", dueDate ? new Date(dueDate) : null, finalUserId]
    );
    return { id: result.insertId, ...datos };
}

// Función asíncrona para recuperar todas las tareas
export async function obtenerTodos() {
    const [rows] = await pool.query('SELECT * FROM tasks');
    return rows;
}

// Función asíncrona para localizar una tarea por ID
export async function obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0] || null;
}

// Función asíncrona para editar los campos de una tarea
export async function actualizar(id, datos) {
    const { title, description, priority, dueDate, userId } = datos;

    let finalUserId = (userId && userId !== "") ? userId : undefined;

    if (finalUserId) {
        const [user] = await pool.query('SELECT id FROM users WHERE id = ?', [finalUserId]);
        if (user.length === 0) finalUserId = null;
    } else if (userId === null || userId === "") {
        finalUserId = null;
    }
    
    await pool.query(
        'UPDATE tasks SET title=?, description=?, priority=?, dueDate=?, userId=? WHERE id=?',
        [title, description, priority, dueDate ? new Date(dueDate) : null, finalUserId, id]
    );
    return obtenerPorId(id);
}

// Función asíncrona para cambiar el estado de una tarea
export async function actualizarEstado(id, estado) {
    await pool.query('UPDATE tasks SET estado=? WHERE id=?', [estado, id]);
    return obtenerPorId(id);
}

// Función asíncrona para eliminar una tarea
export async function eliminar(id) {
    const [result] = await pool.query('DELETE FROM tasks WHERE id=?', [id]);
    return result.affectedRows > 0;
}

// NOTA: Se eliminaron las funciones de asignarUsuarios (muchos a muchos) al no estar presente la tabla intermedia en el esquema actual.

// Función asíncrona para listar tareas de un usuario específico
export async function obtenerTareasPorUsuario(userId) {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE userId=?', [userId]);
    return rows;
}

// Función asíncrona de búsqueda avanzada con filtros
export async function filtrarTareasModel({ estado, prioridad, usuarioId }) {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (estado !== undefined && estado !== null) {
        query += ' AND estado = ?';
        params.push(estado);
    }
    if (prioridad !== undefined && prioridad !== null) {
        query += ' AND priority = ?';
        params.push(prioridad);
    }
    if (usuarioId !== undefined && usuarioId !== null) {
        query += ' AND userId = ?';
        params.push(usuarioId);
    }

    const [rows] = await pool.query(query, params);
    return rows;
}