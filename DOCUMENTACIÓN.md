# Transferencia Backend - Jaider

Este proyecto es una API REST construida con Node.js y Express para la gestión de usuarios y tareas. Proporciona funcionalidades completas de CRUD (Crear, Leer, Actualizar, Eliminar) para ambos módulos, además de un sistema de autenticación simulado.

## Autor
**Jaider Andres Esparza Arenas**

## Arquitectura del Proyecto
El proyecto sigue una arquitectura de capas clara:
- **Controladores (`src/controllers/`):** Contienen la lógica de manejo de peticiones y respuestas HTTP.
- **Modelos (`src/models/`):** Encargados de la gestión de los datos mediante consultas SQL a una base de datos MySQL.
- **Rutas (`src/routes/`):** Definen los puntos de acceso (endpoints) de la API.
- **Punto de Entrada (`src/app.js`):** Configura el servidor Express y une todas las piezas.

## Tecnologías Utilizadas
- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework para la creación de aplicaciones web y APIs.
- **JavaScript (ES Modules)**: Lenguaje de programación principal.
- **MySQL**: Motor de base de datos para el almacenamiento persistente.
- **mysql2**: Driver para la conexión y ejecución de consultas asíncronas.

## Endpoints Principales


### Usuarios
- `GET /api/users`: Lista todos los usuarios.
- `POST /api/users`: Crea un nuevo usuario.
  - **Body esperado:** `{ "nombre": "Juan", "email": "juan@mail.com", "rol": "user" }`
- `GET /api/users/:id`: Obtiene un usuario por su ID.
- `PUT /api/users/:id`: Actualiza los datos de un usuario.
  - **Body esperado:** `{ "nombre": "Juan Perez", "email": "juan@mail.com", "documento": "123" }`
- `DELETE /api/users/:id`: Elimina un usuario.
- `PATCH /api/users/:id/status`: Cambia el estado (activo/inactivo) de un usuario.
  - **Body esperado:** `{ "estado": "inactive" }`
- `GET /api/users/:userId/tasks`: Lista las tareas asignadas a un usuario.

### Tareas
- `GET /api/tasks`: Lista todas las tareas.
- `POST /api/tasks`: Crea una nueva tarea.
  - **Body esperado:** `{ "title": "Nueva Tarea", "description": "Detalles", "priority": "alta" }`
- `GET /api/tasks/:id`: Obtiene una tarea por su ID.
- `PUT /api/tasks/:id`: Actualiza una tarea.
  - **Body esperado:** `{ "title": "Tarea Actualizada" }`
- `DELETE /api/tasks/:id`: Elimina una tarea.
- `PATCH /api/tasks/:id/status`: Cambia el estado de una tarea.
  - **Body esperado:** `{ "estado": "completed" }`
- `POST /api/tasks/:taskId/assign`: Asigna usuarios a una tarea.
  - **Body esperado:** `{ "usuarioIds": [1, 2] }`
- `GET /api/tasks/:taskId/users`: Lista los usuarios asignados a una tarea.
- `GET /api/tasks/filter`: Filtra tareas por estado, prioridad, usuario o fecha.

### Mejoras en la Persistencia (SQL)
- **Integridad Referencial:** Se han implementado claves foráneas para asegurar que las tareas pertenezcan a usuarios válidos.
- **Prevención de Errores:** En la creación/actualización de tareas, si un `userId` no existe, el sistema lo trata como `null` para evitar errores de restricción y mantener la estabilidad.
- **Relaciones Muchos a Muchos:** El sistema permite asignar múltiples usuarios a una sola tarea mediante la tabla intermedia `task_users`.

## Instrucciones de Uso

### Instalación
1. Este paso es **CRITICO** para evitar el error `ERR_MODULE_NOT_FOUND`. Instala las dependencias con:
   ```bash
   npm install
   ```

### Variables de Entorno
Si el proyecto requiere configuraciones específicas como un puerto o claves secretas en el futuro, se recomienda crear un archivo `.env` en la raíz del proyecto. Por defecto, el servidor utiliza el puerto 3000.

### Ejecución
Para iniciar el servidor, utiliza uno de los siguientes comandos:

- **Modo Desarrollo (con Nodemon):**
  ```bash
  npm run dev
  ```

- **Para Producción:**
  ```bash
  npm start
  ```

El servidor correrá por defecto en `http://localhost:3000`.
