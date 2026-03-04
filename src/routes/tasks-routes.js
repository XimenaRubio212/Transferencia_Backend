import { Router } from 'express';

const router = Router();

router.get('/users', (req, res) => {
    res.json({
        message: "Se listarán los usuarios"
    });
});

router.post('/users', (req, res) => {
    res.json({
        message: "Se creará un usuario"
    });
});

export default router;