let listaUsuarios = [ // Definición de una lista inicial de usuarios para simular una base de datos
    { id: 1, email: "admin@email.com",  password: "admin123",  role: "admin" }, // Usuario con privilegios de administrador
    { id: 2, email: "user@email.com",   password: "user123",   role: "user"  }, // Usuario estándar con privilegios limitados
]; // Fin de la lista de usuarios

export function buscarPorEmail(email) { // Función para buscar un usuario en la lista mediante su correo electrónico
    return listaUsuarios.find(u => u.email === email); // Retorna el primer usuario que coincida con el email proporcionado
} // Fin de la función buscarPorEmail

export function generarToken(usuario) { // Función para crear un token de acceso simulado para un usuario
    // Token simulado — en producción se usaría una librería de estándares como JWT (JSON Web Token)
    return `token-simulado-${usuario.id}-${usuario.role}-${Date.now()}`; // Retorna una cadena única compuesta por el ID, el rol y la marca de tiempo actual
} // Fin de la función generarToken