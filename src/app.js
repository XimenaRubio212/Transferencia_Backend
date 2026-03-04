import express from 'express';
import usersRoutes from './routes/users-routes.js';
import tasksRoutes from './routes/tasks-routes.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use(usersRoutes);
app.use(tasksRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});