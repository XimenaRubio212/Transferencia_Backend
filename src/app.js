import express from 'express'; // Importar el framework express para el servidor
import cors from 'cors'; // Importar CORS para permitir peticiones desde el Frontend de Jensen
import 'dotenv/config'; // Importar dotenv para manejar variables de entorno
import './config/db.js'; // Importar la configuración de la base de datos para establecer la conexión

// Importación de los enrutadores de los módulos
import rutasUsuarios from './routes/user.routes.js'; 
import rutasTareas   from './routes/tasks.routes.js'; 
import rutasAuth     from './routes/auth.routes.js'; 

const app = express(); // Instanciar la aplicación express

// --- CONFIGURACIÓN DE MIDDLEWARES ---

// Habilitar CORS para que el Frontend no sea bloqueado por el navegador
app.use(cors()); 

// Habilitar el middleware para entender archivos JSON en el cuerpo de las peticiones
app.use(express.json()); 

// Configuración del puerto para el servidor (prioriza .env, por defecto 3000)
const puerto = process.env.PORT || 3000; 

// --- DEFINICIÓN DE RUTAS (ENDPOINTS) ---

app.use('/api/auth',   rutasAuth);    // Rutas de autenticación (Login/Registro)
app.use('/api/users',  rutasUsuarios); // Rutas de gestión de usuarios
app.use('/api/tasks',  rutasTareas);   // Rutas de gestión de tareas (Task Manager)

// --- MANEJO DE ERRORES (ROBUSTEZ DEL SISTEMA) ---

// Middleware para capturar rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        estado: "error",
        mensaje: "La ruta solicitada no existe en el servidor del Task Manager"
    });
});

// Middleware global para errores del servidor (500)
app.use((err, req, res, next) => {
    console.error("Error detectado:", err.stack);
    res.status(500).json({
        estado: "error",
        mensaje: "Ocurrió un error interno en el servidor",
        error: process.env.NODE_ENV === 'development' ? err.message : {} // Solo muestra detalle en desarrollo
    });
});

// --- INICIO DEL SERVIDOR ---

app.listen(puerto, () => { 
    console.log(`🚀 Servidor corriendo con éxito en http://localhost:${puerto}`); 
    console.log(`📡 Esperando peticiones de Jensen y Jaider...`);
});

export default app; // Exportar la instancia de la app por si se requieren tests unitarios