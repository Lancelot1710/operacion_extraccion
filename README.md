# FPS: Supervivencia en la Mansión

## 1. Descripción del juego

**Supervivencia en la Mansión** es un videojuego de navegador en primera persona (FPS), desarrollado con JavaScript y Three.js. El jugador debe sobrevivir dentro de una mansión infestada de zombis, utilizando armas de fuego para defenderse y recolectando munición durante el recorrido.

El escenario cuenta con habitaciones, pasillos, paredes, obstáculos, iluminación ambiental y un cielo nocturno con estrellas. Los enemigos se activan cuando el jugador se encuentra cerca y comienzan a perseguirlo.

El objetivo principal es llegar a la zona de extracción, identificada por una iluminación verde, evitando ser atrapado por los zombis.

### Características principales

- Escenario tridimensional con perspectiva en primera persona.
- Movimiento y cámara controlados mediante el mouse y el teclado.
- Enemigos con modelos 3D que persiguen al jugador.
- Dos armas disponibles: rifle de asalto y pistola.
- Sistema de munición y recarga mediante coleccionables.
- Detección de colisiones con paredes y obstáculos.
- Efectos de iluminación y sombras.
- Zona de extracción para completar el juego.

## 2. Tecnologías utilizadas

- **JavaScript:** lenguaje principal del proyecto.
- **Three.js:** biblioteca para crear y representar escenarios 3D en el navegador.
- **PointerLockControls:** control de cámara en primera persona mediante el mouse.
- **GLTFLoader:** carga de modelos tridimensionales en formato GLB/GLTF.
- **HTML y CSS:** estructura y presentación de la interfaz del juego.
- **WebGL:** tecnología utilizada para renderizar los gráficos 3D.

## 3. Requisitos previos

Para instalar y ejecutar el proyecto se necesita:

- Node.js instalado en el equipo.
- npm (incluido con Node.js).
- Un navegador web actualizado, como Google Chrome, Microsoft Edge o Firefox.
- Editor de código, como Visual Studio Code.
- Conexión a Internet para instalar las dependencias.

## 4. Estructura del proyecto

La estructura recomendada de carpetas es la siguiente:

```text
Proyecto-FPS/
│
├── index.html
├── main.js
├── package.json
│
└── assets/
    ├── models/
    │   ├── arma1.glb
    │   ├── arma2.glb
    │   └── zombie.glb
    │
    └── textures/
        ├── wall_texture.png
        └── crate_texture.jpg
```

**Nota:** Los nombres y las rutas de los modelos y texturas deben coincidir exactamente con los utilizados en el código. El cielo nocturno con estrellas se genera mediante código, por lo que no necesita una imagen externa.

## 5. Instalación

Sigue estos pasos para preparar el proyecto:

**Paso 1.** Descargar o copiar los archivos del proyecto en una carpeta local.

**Paso 2.** Abrir la carpeta del proyecto desde Visual Studio Code.

**Paso 3.** Abrir una terminal dentro de la carpeta y ejecutar:

```bash
npm init -y
```

**Paso 4.** Instalar Three.js:

```bash
npm install three
```

**Paso 5.** Instalar Vite como servidor de desarrollo:

```bash
npm install -D vite
```

**Paso 6.** Configurar el archivo `package.json` para incluir el siguiente script:

```json
"scripts": {
  "dev": "vite"
}
```

Con esto, el proyecto queda preparado para ejecutarse mediante un servidor local.

## 6. Ejecución del juego

**Paso 1.** Abrir la terminal en la carpeta principal del proyecto.

**Paso 2.** Ejecutar el siguiente comando:

```bash
npm run dev
```

**Paso 3.** Esperar a que Vite inicie el servidor local.

**Paso 4.** Abrir en el navegador la dirección que aparece en la terminal, normalmente:

```text
http://localhost:5173/
```

**Paso 5.** Hacer clic en la pantalla de instrucciones para activar los controles del juego.

**Importante:** No se recomienda abrir directamente el archivo `index.html` haciendo doble clic, ya que los módulos de JavaScript y la carga de modelos y texturas requieren un servidor local.

## 7. Controles del juego

| Tecla o acción | Función |
|---|---|
| W o ↑ | Avanzar |
| S o ↓ | Retroceder |
| A o ← | Moverse a la izquierda |
| D o → | Moverse a la derecha |
| Mouse | Girar la cámara y apuntar |
| Clic izquierdo | Disparar |
| Tecla 1 | Seleccionar rifle de asalto |
| Tecla 2 | Seleccionar pistola |
| Esc | Liberar el cursor del juego |

## 8. Objetivo y mecánicas

El jugador comienza dentro de la mansión con dos armas y una cantidad inicial de munición.

- **Rifle de asalto:** comienza con 30 unidades de munición.
- **Pistola:** comienza con 12 unidades de munición.
- **Enemigos:** el escenario contiene 18 zombis. Cada uno requiere dos impactos para ser eliminado.
- **Munición adicional:** existen cajas coleccionables que proporcionan 15 unidades para el rifle y 6 para la pistola.
- **Zona de extracción:** se encuentra identificada por una plataforma iluminada de color verde.

### Condiciones de victoria y derrota

- **Victoria:** llegar a la zona de extracción y completar el recorrido.
- **Derrota:** ser alcanzado por uno de los zombis.

Al finalizar una partida, se muestra un mensaje indicando si el jugador logró sobrevivir o fue atrapado.

## 9. Fuentes de recursos externos

El proyecto utiliza bibliotecas y recursos externos para implementar sus funcionalidades y elementos visuales.

| Recurso | Uso | Fuente |
|---|---|---|
| Three.js | Renderizado de escenarios 3D | https://threejs.org/ |
| PointerLockControls | Control de cámara FPS | https://threejs.org/docs/#examples/en/controls/PointerLockControls |
| GLTFLoader | Carga de modelos 3D | https://threejs.org/docs/#examples/en/loaders/GLTFLoader |
| Modelos GLB | Armas y enemigos | Archivos incluidos en `assets/models/` |
| Texturas PNG/JPG | Paredes y cajas | Archivos incluidos en `assets/textures/` |

**Nota sobre los recursos:** Las direcciones anteriores corresponden a la documentación oficial de las bibliotecas. Los autores y las páginas originales de descarga de los modelos y texturas deben agregarse cuando se conozcan. No se atribuyen recursos a autores que no hayan sido verificados.

## 10. Consideraciones finales

Para garantizar el funcionamiento correcto del videojuego, se recomienda mantener la estructura de carpetas, verificar que los modelos y texturas estén disponibles y ejecutar el proyecto mediante un servidor local.

El proyecto demuestra el uso de gráficos tridimensionales, detección de colisiones, carga de modelos, controles de primera persona, iluminación y lógica de interacción para desarrollar un videojuego de supervivencia en el navegador.