-- se crea la base de datos
create database tasks_manager_db;

-- se crea el usuario para la aplicacion
create user 'tasks_user'@'localhost' identified by 'tasks1234';

-- se le da permisos sobr esa base de datos
grant all privileges on tasks_manager_db.* to 'tasks_user'@'localhost';
flush privileges;

-- se le selecciona la base de datos para crear las tablas
use tasks_manager_db;

-- tabla de usuarios
create table users (
id int auto_increment primary key,
documento varchar(20),
nombre varchar(100) not null,
email varchar(100) not null unique,
rol varchar(20) default 'user',
estado varchar(20) default 'activo',
createdAt timestamp default current_timestamp
);

-- tabla de tareas
create table tasks (
id int auto_increment primary key,
title varchar(200) not null,
description varchar(500) default '',
estado varchar(20) default 'pendiente',
priority varchar(20) default 'medio',
userId int,
dueDate datetime null,
createdAt timestamp default current_timestamp,
foreign key (userId) references users(id) on delete set null
);

-- Insertar usuarios de JSON
insert into users (id, documento, nombre, email) values 
(1, '10203040', 'Juan Pérez', 'juan.perez@email.com'),
(2, '50607080', 'Maria Garcia', 'm.garcia@email.com'),
(3, '11223344', 'Carlos López', 'c.lopez@email.com');

-- Insertar tareas relacionadas con los IDs 1, 2 y 3
insert into tasks (title, description, estado, priority, userId) values 
('Revisar Servidor', 'Verificar la conexión de la base de datos', 'pendiente', 'alta', 1),
('Actualizar Frontend', 'Cambiar los colores del dashboard', 'en progreso', 'media', 2),
('Documentar API', 'Escribir los endpoints en el README', 'completado', 'baja', 3);

show grants for 'tasks_user'@'localhost';