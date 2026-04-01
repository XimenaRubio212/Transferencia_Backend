import pool from '../config/db.js'; // Importa el pool de conexiones configurado
import { obtenerTareasPorUsuario as obtenerTareasDesdeModeloTareas } from './tasks.module.js'; // Importa la función de búsqueda de tareas para relacionarlas

// Función asíncrona para registrar un nuevo usuario en la base de datos MySQL
export async function crear(datos) {
    const { nombre, email, documento, rol, estado } = datos; // Desestructura los campos necesarios de los datos de entrada
    const [result] = await pool.query( // Ejecuta el INSERT en la tabla 'users'
        'INSERT INTO users (nombre, email, documento, rol, estado) VALUES (?, ?, ?, ?, ?)',
        [nombre, email, documento, rol || "user", estado || "active"] // Usa valores por defecto si no se proporcionan
    );
    return { id: result.insertId, ...datos }; // Retorna el objeto del usuario incluyendo el ID generado automáticamente
}

// Función asíncrona para obtener el listado completo de usuarios
export async function obtenerTodos() {
    const [rows] = await pool.query('SELECT * FROM users'); // Ejecuta el SELECT para traer todos los registros
    return rows; // Retorna el arreglo de usuarios encontrados
}

// Función asíncrona para localizar un usuario por su identificador único (ID)
export async function obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]); // Busca el usuario por ID
    return rows[0] || null; // Retorna el primer resultado o nulo si no existe
}

// Función asíncrona para buscar un usuario por su correo electrónico
export async function obtenerPorEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]); // Ejecuta la consulta filtrando por email
    return rows[0] || null; // Retorna el usuario o nulo si es un correo nuevo
}

// Función asíncrona para actualizar la información básica de un usuario
export async function actualizar(id, datos) {
    const { nombre, email, documento } = datos; // Obtiene los campos permitidos para la actualización
    await pool.query( // Ejecuta el UPDATE con los nuevos valores
        'UPDATE users SET nombre=?, email=?, documento=? WHERE id=?',
        [nombre, email, documento, id]
    );
    return obtenerPorId(id); // Retorna el usuario actualizado consultándolo de nuevo
}

// Función asíncrona dedicada a cambiar el estado de un usuario (activo/inactivo)
export async function actualizarEstado(id, estado) {
    await pool.query('UPDATE users SET estado=? WHERE id=?', [estado, id]); // Realiza el cambio de estado mediante UPDATE
    return obtenerPorId(id); // Retorna el usuario con el nuevo estado reflejado
}

// Función asíncrona para eliminar definitivamente a un usuario del sistema
export async function eliminar(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id=?', [id]); // Ejecuta el DELETE para borrar el registro
    return result.affectedRows > 0; // Retorna verdadero si se borró al menos una fila, falso en caso contrario
}

// Función asíncrona puente para consultar las tareas vinculadas a un usuario específico
export async function obtenerTareasPorUsuario(usuarioId) {
    return await obtenerTareasDesdeModeloTareas(usuarioId); // Llama a la lógica de tareas para obtener las asignaciones
}