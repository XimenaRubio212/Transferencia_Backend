# Transferencia Backend - Jaider

Este proyecto es una API REST construida con Node.js y Express para la gestión de usuarios y tareas. Proporciona funcionalidades completas de CRUD (Crear, Leer, Actualizar, Eliminar) para ambos módulos, además de un sistema de autenticación simulado.

## Autor
**Jaider Andres Esparza Arenas**

## Arquitectura del Proyecto
El proyecto sigue una arquitectura de capas clara:
- **Controladores (`src/controllers/`):** Contienen la lógica de manejo de peticiones y respuestas HTTP.
- **Modelos (`src/models/`):** Encargados de la gestión de los datos (actualmente almacenados en memoria).
- **Rutas (`src/routes/`):** Definen los puntos de acceso (endpoints) de la API.
- **Punto de Entrada (`src/app.js`):** Configura el servidor Express y une todas las piezas.

## Tecnologías Utilizadas
- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework para la creación de aplicaciones web y APIs.
- **JavaScript (ES Modules)**: Lenguaje de programación principal.

## Endpoints Principales

### Autenticación
- `POST /api/auth/login`: Inicia sesión y devuelve un token simulado.

### Usuarios
- `GET /api/users`: Lista todos los usuarios.
- `POST /api/users`: Crea un nuevo usuario.
- `GET /api/users/:id`: Obtiene un usuario por su ID.
- `PUT /api/users/:id`: Actualiza los datos de un usuario.
- `DELETE /api/users/:id`: Elimina un usuario.
- `PATCH /api/users/:id/status`: Cambia el estado (activo/inactivo) de un usuario.
- `GET /api/users/:userId/tasks`: Lista las tareas asignadas a un usuario.

### Tareas
- `GET /api/tasks`: Lista todas las tareas.
- `POST /api/tasks`: Crea una nueva tarea.
- `GET /api/tasks/:id`: Obtiene una tarea por su ID.
- `PUT /api/tasks/:id`: Actualiza una tarea.
- `DELETE /api/tasks/:id`: Elimina una tarea.
- `PATCH /api/tasks/:id/status`: Cambia el estado de una tarea.
- `POST /api/tasks/:taskId/assign`: Asigna usuarios a una tarea.
- `GET /api/tasks/:taskId/users`: Lista los usuarios asignados a una tarea.
- `GET /api/tasks/filter`: Filtra tareas por estado, prioridad, usuario o fecha.

## Instrucciones de Uso
1. Instalar las dependencias con `npm install`.
2. Ejecutar el servidor (requiere configuración de script en `package.json` o ejecución directa de `node src/app.js`).
3. El servidor correrá por defecto en `http://localhost:3000`.
