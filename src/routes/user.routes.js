import { Router } from "express"; // Importar la funcionalidad Router de express para la gestión de navegación
// Importamos los nombres actualizados del controlador de usuarios para ser usados en las rutas
import { 
    crearUsuario, 
    obtenerTodosLosUsuarios, 
    obtenerUsuarioPorId, 
    actualizarUsuario, 
    eliminarUsuario, 
    actualizarEstadoUsuario, 
    verTareasPorUsuario 
} from "../controllers/user.controller.js"; // Fin de la de importaciones de controladores de usuarios

const router = Router(); // Inicializar el enrutador específico para las rutas de usuarios

router.post('/', crearUsuario); // Definir ruta POST para el registro de nuevos usuarios en el sistema
router.get('/', obtenerTodosLosUsuarios); // Definir ruta GET para obtener la lista de todos los usuarios registrados
router.get('/:id', obtenerUsuarioPorId); // Definir ruta GET con ID para buscar el perfil de un usuario específico
router.put('/:id', actualizarUsuario); // Definir ruta PUT con ID para la edición de los datos de un usuario
router.delete('/:id', eliminarUsuario); // Definir ruta DELETE con ID para borrar la cuenta de un usuario
router.patch('/:id/status', actualizarEstadoUsuario); // Definir ruta PATCH para conmutar el estado del usuario (activo/inactivo)
router.get('/:userId/tasks', verTareasPorUsuario); // Definir ruta GET para listar las tareas asignadas a un usuario particular

export default router; // Exportar el enrutador configurado para su uso en la aplicación express