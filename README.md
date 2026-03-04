# 🎓 Proyecto: Servidor de Gestión Académica (Punto D - Transferencia)

Este repositorio contiene la implementación de un servidor backend básico desarrollado como parte de las actividades de apropiación y transferencia de conocimiento de la guía **GFPI-F-135 V04**. El proyecto demuestra el dominio práctico en la configuración de entornos con **Node.js** y la creación de APIs con **Express.js**.

## 🎯 Propósito del Proyecto
El objetivo principal de este desarrollo es aplicar conceptos de arquitectura cliente-servidor para resolver una situación práctica de gestión educativa. El servidor está diseñado para:
* **Validar la conectividad:** Asegurar que el entorno de Node.js responda correctamente a peticiones HTTP.
* **Gestionar Rutas:** Implementar puntos de acceso (endpoints) que entreguen información descriptiva sobre módulos de aprendices y programas.
* **Demostrar Modularidad:** Establecer una base sólida y organizada que permita el crecimiento hacia un sistema integrador de tecnologías.

## 📂 Estructura del Proyecto
Se ha mantenido un criterio técnico profesional en la organización de archivos para facilitar la mantenibilidad y el escalonamiento:

```text
📁 gestion-academica-node
├── 📁 node_modules/       # Dependencias del proyecto (Express)
├── 📄 main.js             # Punto de entrada y lógica principal del servidor
├── 📄 package.json        # Manifiesto del proyecto (metadatos y dependencias)
├── 📄 package-lock.json   # Registro detallado del árbol de dependencias
└── 📄 .gitignore          # Exclusión de archivos pesados y temporales

 Cómo Ejecutar el Proyecto
Siga estos pasos detallados para poner en marcha el servidor en su entorno local:

1. Requisitos Previos
Asegúrese de tener instalado Node.js (se recomienda la versión LTS) y el gestor de paquetes npm en su máquina.

2. Clonación e Instalación
Primero, clone el repositorio o descargue los archivos. Luego, desde la terminal situada en la carpeta raíz del proyecto, instale las dependencias necesarias:

Bash

npm install
Este comando leerá el archivo package.json y descargará Express en la carpeta node_modules.

3. Inicio del Servidor
Para ejecutar la aplicación, utilice el comando de Node.js sobre el archivo principal:

Bash

node main.js
Si la configuración es correcta, verá un mensaje en consola indicando:

Servidor de Gestión Académica escuchando en http://localhost:3000

4. Pruebas y Validación
Puede verificar el funcionamiento del servidor accediendo a las siguientes rutas desde su navegador o cliente de APIs (como Postman o Thunder Client):

Página Principal: http://localhost:3000/

(Muestra el mensaje de bienvenida al sistema).

Módulo Aprendices: http://localhost:3000/aprendices

(Muestra la descripción de la gestión de aprendices).

Módulo Programas: http://localhost:3000/programas

(Muestra la información sobre programas de formación).

Desarrollado por: [Tu Nombre]

Programa: Tecnología en Análisis y Desarrollo de Software

Fase: Ejecución - Backend Node.js

