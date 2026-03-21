// --- AUTH SIMULACIÓN DE LOGIN ---
import { Router } from 'express'; // Importar el módulo Router de la librería express
import { login } from '../controllers/auth.controller.js'; // Importar la función controladora de login

const router = Router(); // Iniciar una nueva instancia del enrutador de express

router.post('/login', login); // Definir una ruta de tipo POST para el endpoint '/login' que usa el controlador login

export default router; // Exportar el enrutador para que pueda ser utilizado en la aplicación principal