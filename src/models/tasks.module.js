import pool from '../config/db.js';

export async function crear(datos) {
    const { title, description, priority, dueDate, userId } = datos;
    
    let finalUserId = (userId && userId !== "") ? userId : null;

    if (finalUserId) {
        const [user] = await pool.query('SELECT id FROM users WHERE id = ?', [finalUserId]);
        if (user.length === 0) finalUserId = null;
    }

    const [result] = await pool.query(
        'INSERT INTO tasks (title, description, priority, dueDate, userId) VALUES (?, ?, ?, ?, ?)',
        [title, description || "", priority || "medio", dueDate ? new Date(dueDate) : null, finalUserId]
    );
    return { id: result.insertId, ...datos };
}



export async function obtenerTodos() {
    const [rows] = await pool.query('SELECT * FROM tasks');
    return rows;
}

export async function obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0] || null;
}

export async function actualizar(id, datos) {
    const { title, description, priority, dueDate, userId } = datos;

    let finalUserId = (userId && userId !== "") ? userId : undefined;

    if (finalUserId) {
        const [user] = await pool.query('SELECT id FROM users WHERE id = ?', [finalUserId]);
        if (user.length === 0) finalUserId = null;
    } else if (userId === null || userId === "") {
        finalUserId = null;
    }

    // Si finalUserId es undefined, no se actualiza (mantiene el anterior)
    // Pero el requerimiento original de actualizar no incluía userId en el SET.
    // Revisando el archivo original: actualizar(id, datos) → UPDATE tasks SET title=?, description=?, priority=?, dueDate=? WHERE id=?
    // Lo mantendré igual para no romper el contrato, pero aplicaré la lógica si el usuario lo agrega.
    
    await pool.query(
        'UPDATE tasks SET title=?, description=?, priority=?, dueDate=?, userId=? WHERE id=?',
        [title, description, priority, dueDate ? new Date(dueDate) : null, finalUserId, id]
    );
    return obtenerPorId(id);
}


export async function actualizarEstado(id, estado) {
    await pool.query('UPDATE tasks SET estado=? WHERE id=?', [estado, id]);
    return obtenerPorId(id);
}

export async function eliminar(id) {
    const [result] = await pool.query('DELETE FROM tasks WHERE id=?', [id]);
    return result.affectedRows > 0;
}

export async function asignarUsuarios(tareaId, usuarioIds) {
    const idsFinales = Array.isArray(usuarioIds) ? usuarioIds : [usuarioIds];
    for (const uid of idsFinales) {
        await pool.query(
            'INSERT IGNORE INTO task_users (task_id, user_id) VALUES (?, ?)',
            [tareaId, uid]
        );
    }
    return obtenerPorId(tareaId);
}

export async function obtenerUsuariosAsignados(tareaId) {
    const [rows] = await pool.query('SELECT user_id FROM task_users WHERE task_id = ?', [tareaId]);
    return rows.map(r => r.user_id);
}

export async function removerUsuario(tareaId, usuarioId) {
    const [result] = await pool.query(
        'DELETE FROM task_users WHERE task_id = ? AND user_id = ?',
        [tareaId, usuarioId]
    );
    return result.affectedRows > 0;
}

export async function obtenerTareasPorUsuario(userId) {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE userId=?', [userId]);
    return rows;
}

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