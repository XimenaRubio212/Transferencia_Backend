import pool from '../config/db.js';
import { obtenerTareasPorUsuario as obtenerTareasDesdeModeloTareas } from './tasks.module.js';

export async function crear(datos) {
    const { nombre, email, documento, rol, estado } = datos;
    const [result] = await pool.query(
        'INSERT INTO users (nombre, email, documento, rol, estado) VALUES (?, ?, ?, ?, ?)',
        [nombre, email, documento, rol || "user", estado || "active"]
    );
    return { id: result.insertId, ...datos };
}

export async function obtenerTodos() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

export async function obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
}

export async function obtenerPorEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
}

export async function actualizar(id, datos) {
    const { nombre, email, documento } = datos;
    await pool.query(
        'UPDATE users SET nombre=?, email=?, documento=? WHERE id=?',
        [nombre, email, documento, id]
    );
    return obtenerPorId(id);
}

export async function actualizarEstado(id, estado) {
    await pool.query('UPDATE users SET estado=? WHERE id=?', [estado, id]);
    return obtenerPorId(id);
}

export async function eliminar(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id=?', [id]);
    return result.affectedRows > 0;
}

export async function obtenerTareasPorUsuario(usuarioId) {
    return await obtenerTareasDesdeModeloTareas(usuarioId);
}