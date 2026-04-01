import { Router } from 'express'; // Importar el componente Router de express para gestionar las rutas
// Importamos los nombres actualizados del controlador de tareas para vincularlos a los endpoints
import {
    crearTarea,
    obtenerTodasLasTareas,
    obtenerTareaPorId,
    actualizarTarea,
    eliminarTarea,
    cambiarEstadoTarea,
    asignarTarea,
    obtenerUsuariosDeTarea,
    removerUsuarioDeTarea,
    filtrarTareas
} from '../controllers/tasks.controller.js'; // Fin de la importación de controladores de tareas

const router = Router(); // Crear una instancia del enrutador de express

// Filtros primero para evitar que colisionen con el :id (Prioridad de rutas)
router.get('/filter', filtrarTareas); // Ruta GET para aplicar filtros avanzados a las tareas

router.post('/', crearTarea); // Ruta POST en la raíz para la creación de una nueva tarea
router.get('/', obtenerTodasLasTareas); // Ruta GET en la raíz para listar todas las tareas del sistema
router.get('/:id', obtenerTareaPorId); // Ruta GET con parámetro ID para consultar una tarea específica
router.put('/:id', actualizarTarea); // Ruta PUT con parámetro ID para actualizar completamente una tarea
router.delete('/:id', eliminarTarea); // Ruta DELETE con parámetro ID para remover una tarea del sistema
router.patch('/:id/status', cambiarEstadoTarea); // Ruta PATCH para modificar parcialmente solo el estado de una tarea
router.post('/:taskId/assign', asignarTarea); // Ruta POST para asignar usuarios a una tarea mediante su ID
router.get('/:taskId/users', obtenerUsuariosDeTarea); // Ruta GET para ver los usuarios vinculados a una tarea específica
router.delete('/:taskId/users/:userId', removerUsuarioDeTarea); // Ruta DELETE para desvincular un usuario de una tarea concreta

export default router; // Exportar el enrutador de tareas para su integración en app.js