import { Router } from 'express';

const router = Router();

router.get('/tasks', (req, res) => {
    res.json({
        message: "Se listarán las tareas"
    });
});

router.post('/tasks', (req, res) => {
    res.json({
        message: "Se creará una tarea"
    });
});

export default router;