import express from 'express'; // Importar el framework express para el servidor
import 'dotenv/config'; // Importar dotenv para manejar variables de entorno
import './config/db.js'; // Importar la configuración de la base de datos para establecer la conexión
import rutasUsuarios from './routes/user.routes.js'; // Importar el enrutador de usuarios
import rutasTareas   from './routes/tasks.routes.js'; // Importar el enrutador de tareas
import rutasAuth     from './routes/auth.routes.js'; // Importar el enrutador de autenticación

const app = express(); // Instanciar la aplicación express
// Configuración del puerto para el servidor, utilizando una variable de entorno o un valor por defecto
const puerto = process.env.PORT || 3000; // Asignar el número del puerto en el que correrá el servidor

app.use(express.json()); // Habilitar el middleware para entender archivos JSON

// Definición de las Rutas de los módulos
app.use('/api/auth',  rutasAuth); // Usar las rutas de autenticación bajo el prefijo /api/auth
app.use('/api/users', rutasUsuarios); // Usar las rutas de usuarios bajo el prefijo /api/users
app.use('/api/tasks', rutasTareas); // Usar las rutas de tareas bajo el prefijo /api/tasks


app.listen(puerto, () => { // Poner el servidor a escuchar en el puerto definido
    console.log(`Servidor corriendo en http://localhost:${puerto}`); // Confirmar el inicio del servidor en la consola
});