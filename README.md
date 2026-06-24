# Vacomercio - Plataforma de Comercialización de Ganado

¡Bienvenido al proyecto **Vacomercio**! Este es un monorepo diseñado para facilitar la publicación, loteo, visualización e interés en la compra y venta de ganado en Colombia.

El proyecto está estructurado como un monorepo de Node.js utilizando **npm Workspaces**.

---

## 🏗️ Arquitectura del Proyecto

El monorepo se divide en tres paquetes principales dentro de las carpetas `apps` y `packages`:

1. **`apps/api` (Backend)**:
   - Desarrollado con **NestJS** y **TypeScript**.
   - Base de datos relacional **PostgreSQL** administrada mediante **Prisma ORM**.
   - Validación de datos mediante `class-validator` y transformación con `class-transformer`.
   - Integración con **Supabase** para almacenamiento de imágenes de ganado (Supabase Storage).
   - Generación automática de enlaces preconfigurados de WhatsApp para conectar compradores con vendedores.

2. **`apps/web` (Frontend)**:
   - Desarrollado con **Next.js 14** (utilizando el App Router) y **TypeScript**.
   - Estilizado con **Tailwind CSS**.
   - Consume la API expuesta por el backend.

3. **`packages/shared` (Biblioteca Compartida)**:
   - Contiene tipos de TypeScript comunes (`User`, `Animal`, `Lot`, etc.) y constantes compartidas (como la distribución geográfica de regiones, departamentos y municipios en Colombia).

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado en tu máquina:
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [Docker](https://www.docker.com/) y **Docker Compose** (para correr la base de datos local)
- [NPM](https://www.npmjs.com/) (incluido con Node.js)

---

## 🚀 Guía de Configuración Rápida (Onboarding)

Sigue estos pasos para levantar el entorno de desarrollo local:

### 1. Clonar el repositorio y configurar variables de entorno
Crea los archivos `.env` correspondientes para el backend (en la raíz `/`) y el frontend (en `/apps/web/.env`).

> [!IMPORTANT]
> Por motivos de seguridad, las credenciales no están incluidas en esta documentación. Solicita los valores y claves secretas de los archivos `.env` (como accesos de base de datos y credenciales de Supabase) directamente al administrador del proyecto para configurarlos localmente.

### 2. Instalar dependencias
Desde la raíz del proyecto, ejecuta el siguiente comando para instalar las dependencias de todos los workspaces:
```bash
npm install
```

### 3. Levantar la Base de Datos con Docker
El proyecto utiliza Docker Compose para simplificar el levantamiento de la base de datos PostgreSQL. Corre el siguiente comando:
```bash
docker-compose up -d vacomercio-db
```
*Nota: Si prefieres levantar todo el ecosistema (BD + API + Frontend) en contenedores de Docker, simplemente ejecuta `docker-compose up`.*

### 4. Preparar Prisma (Migraciones y Generación de Tipos)
Una vez que el contenedor de la base de datos esté activo e inicie correctamente:
```bash
# Ejecutar migraciones pendientes sobre la base de datos local
npm run prisma:migrate

# Generar el cliente de Prisma en node_modules
npm run prisma:generate
```

### 5. Sembrar Datos Iniciales (Seed)
Para poder usar la plataforma, necesitas tener al menos un usuario de prueba en la base de datos. Ejecuta el script de semilla ubicado en la raíz del proyecto:
```bash
npx ts-node seed-user.ts
```
Esto creará automáticamente un usuario de prueba con ID `user-1` (Ganadero, en Medellín, Antioquia), que podrás utilizar en las solicitudes API de creación de animales o lotes.

### 6. Ejecutar en Modo de Desarrollo (Host Local)
Puedes levantar el backend y el frontend de forma independiente en tu terminal:

- **Iniciar Backend (NestJS)**:
  ```bash
  npm run api:dev
  ```
  La API se ejecutará en: `http://localhost:3001`

- **Iniciar Frontend (Next.js)**:
  ```bash
  npm run web:dev
  ```
  La aplicación web se ejecutará en: `http://localhost:3000`

---

## 🗃️ Modelo de Datos (Prisma Schema)

Los modelos principales de la base de datos se encuentran en `apps/api/prisma/schema.prisma`:

- **User**: Representa a los usuarios del sistema. Pueden ser de tipo `GANADERO` o `COMPRADOR`. Contiene datos de localización (`departamento`, `municipio`), número de teléfono y reputación promedio calculada.
- **Animal**: Animales registrados individualmente. Tienen atributos como `raza`, `tipo`, `peso`, `precio`, `estado` (`DISPONIBLE`, `EN_LOTE`, `VENDIDO`) y campos médicos para inocuidad alimentaria.
- **Lot**: Agrupación lógica de animales (creada por un Ganadero) para venta en lote. Almacena campos consolidados como `cantidad` de cabezas, `peso_total` y `peso_promedio`.
- **Interest**: Registro de intención de compra de un comprador sobre un animal o lote.
- **Sale**: Registro histórico de transacciones exitosas (ventas finalizadas).
- **Rating**: Calificaciones y comentarios (de 1 a 5 estrellas) asociados a una venta para construir la reputación de los ganaderos.

---

## 🔌 Documentación de Endpoints (API)

A continuación se detallan los endpoints disponibles en el backend NestJS (`http://localhost:3001`):

### 1. 🐄 Animales (`/animals`)

Controla el ciclo de vida de los animales individuales.

*   **`GET /animals`**
    *   **Descripción:** Obtiene todos los animales registrados.
    *   **Respuesta:** Lista de animales incluyendo su lote y usuario propietario.

*   **`GET /animals/:id`**
    *   **Descripción:** Obtiene el detalle de un animal por su ID.
    *   **Respuesta:** Objeto del animal con información detallada de su lote y propietario.

*   **`POST /animals`**
    *   **Descripción:** Registra un nuevo animal. Soporta la subida de imágenes a Supabase Storage mediante adjunto de archivo.
    *   **Encabezado requerido:** `Content-Type: multipart/form-data`
    *   **Cuerpo de la Petición (Form-data):**
        *   `nombre` *(string)*: Nombre identificativo del animal.
        *   `arete` *(string)*: Número de arete identificador único.
        *   `raza` *(enum)*: Raza del ganado (`BRAHMAN`, `GYR`, `ANGUS`, `CEBU`, `CRUZADO`, `NELORE`, `SIMMENTAL`).
        *   `tipo` *(enum)*: Tipo de ganado (`NOVILLO`, `VACA`, `TORO`).
        *   `peso` *(number)*: Peso del animal en Kg (debe ser mayor a 0 y menor a 1500).
        *   `precio` *(number)*: Precio de venta del animal.
        *   `userId` *(string)*: ID del usuario creador (e.g. `user-1`).
        *   `file` *(file, opcional)*: Archivo de imagen del animal.
        *   `loteId` *(string, opcional)*: ID del lote al que se asocia (automáticamente cambia su estado a `EN_LOTE`).
        *   `en_periodo_retiro` *(boolean, opcional)*: `true` si el animal está en periodo de retiro por medicamentos veterinarios.
        *   `medicamento_retiro` *(string, opcional)*: Nombre del medicamento administrado.
        *   `fecha_limite_retiro` *(string ISO, opcional)*: Fecha límite de carencia médica.

*   **`PATCH /animals/:id`**
    *   **Descripción:** Actualiza los datos de un animal existente.
    *   **Cuerpo de la Petición (JSON - Opcionales):**
        - Campos similares a la creación más `estado` (`DISPONIBLE`, `EN_LOTE`, `VENDIDO`).
    *   **Regla de Negocio:** Si se desvincula de un lote (`loteId: null`), el estado regresa automáticamente a `DISPONIBLE` (siempre que no esté vendido).

*   **`DELETE /animals/:id`**
    *   **Descripción:** Elimina un animal del catálogo.

---

### 📦 2. Lotes (`/lots`)

Permite la creación de grupos dinámicos de animales para su venta conjunta.

*   **`GET /lots`**
    *   **Descripción:** Lista todos los lotes de ganado disponibles.
    *   **Respuesta:** Lista de lotes con el detalle de los animales contenidos y su propietario.

*   **`GET /lots/:id`**
    *   **Descripción:** Obtiene los detalles de un lote en específico por su ID.

*   **`POST /lots/create-dynamic`**
    *   **Descripción:** Crea un lote a partir de una lista de animales existentes que pertenecen al mismo usuario.
    *   **Cuerpo de la Petición (JSON):**
        ```json
        {
          "nombre": "Lote Brahman Comercial",
          "animalIds": ["id_animal_1", "id_animal_2"],
          "precio": 5000000, 
          "departamento": "Córdoba",
          "municipio": "Montería",
          "userId": "user-1",
          "foto_url": "http://opcional.com/foto.jpg"
        }
        ```
        *Nota: Si el campo `precio` no es enviado, el sistema calcula de forma automática la suma de los precios individuales de los animales seleccionados.*
    *   **Regla de Negocio Crítica:** Se realiza un análisis de inocuidad alimentaria. Si alguno de los animales seleccionados para conformar el lote posee un periodo de retiro médico activo (medicamento veterinario pendiente para consumo directo), **la creación del lote se bloquea arrojando un error HTTP 403 (SanityCheckFailed)**.

---

### 🌾 3. Marketplace Feed (`/marketplace`)

Visualización centralizada de publicaciones en la plataforma.

*   **`GET /marketplace/feed`**
    *   **Descripción:** Retorna una lista unificada de elementos disponibles en el mercado (animales individuales y lotes creados), ordenados cronológicamente de forma descendente y paginados.
    *   **Parámetros de Consulta (Query Params - Opcionales):**
        *   `departamento` *(string)*: Filtra por departamento (e.g. `Córdoba`, `Antioquia`).
        *   `municipio` *(string)*: Filtra por municipio.
        *   `raza` *(string)*: Filtra animales individuales de una raza específica.
        *   `region` *(string)*: Agrupa departamentos por región geográfica (`Costa Caribe`, `Eje Cafetero`, `Llanos Orientales`).
        *   `priceCategory` *(enum)*: Filtro por categoría de precio predefinida:
            - `LEVANTE`: Precios entre `$800,000` y `$1,500,000` COP.
            - `COMERCIAL`: Precios entre `$1,500,000` y `$3,500,000` COP.
            - `ELITE`: Precios desde `$5,000,000` COP en adelante.
        *   `tipo` *(enum)*: Filtra por tipo de publicación (`individual` o `lote`).
        *   `page` *(number, por defecto 1)*: Página a solicitar.
        *   `limit` *(number, por defecto 10)*: Tamaño de página.

---

### 💬 4. Intereses (`/interests`)

Registra la intención de compra de un cliente y proporciona enlace directo de contacto.

*   **`GET /interests`**
    *   **Descripción:** Lista todos los registros de interés del sistema.

*   **`POST /interests`**
    *   **Descripción:** Registra un nuevo interés sobre un animal o un lote y genera un enlace preconfigurado de chat de WhatsApp para el vendedor directo.
    *   **Cuerpo de la Petición (JSON):**
        ```json
        {
          "compradorId": "id_usuario_comprador",
          "animalId": "id_animal_opcional",
          "loteId": "id_lote_opcional"
        }
        ```
    *   **Respuesta Exitosa (JSON):**
        ```json
        {
          "message": "Interés registrado con éxito.",
          "interest": {
            "id": "cuid_generado",
            "compradorId": "id_usuario_comprador",
            "animalId": "id_animal_opcional",
            "loteId": "id_lote_opcional",
            "timestamp": "2026-06-24T..."
          },
          "whatsappLink": "https://wa.me/573001234567?text=Hola%2C%20soy%20..."
        }
        ```
    *   **Detalle:** El `whatsappLink` simula un mensaje personalizado como: *“Hola, soy [NombreComprador]. Estoy interesado en tu publicación de ganado: [NombreGanado] ubicada en [Municipio]. Vi tu publicación en la plataforma Vacomercio.”* listo para que el frontend redirija al usuario al chat directo del ganadero vendedor.

---

### 💰 5. Ventas (`/sales`)

Registra el cierre de transacciones en la plataforma.

*   **`GET /sales`**
    *   **Descripción:** Lista todas las transacciones de ventas históricas.

*   **`POST /sales/mark-sold`**
    *   **Descripción:** Registra la venta definitiva de un animal o lote y actualiza automáticamente sus respectivos estados a `VENDIDO`.
    *   **Cuerpo de la Petición (JSON):**
        ```json
        {
          "vendedorId": "id_vendedor",
          "precio_final": 4800000,
          "animalId": "id_animal_opcional",
          "loteId": "id_lote_opcional",
          "compradorId": "id_comprador_opcional",
          "compradorTelefono": "3007654321"
        }
        ```

---

### ⭐ 6. Reputación y Calificaciones (`/reputation`)

Permite valorar la seriedad y calidad del vendedor post-venta.

*   **`GET /reputation/user/:userId`**
    *   **Descripción:** Retorna todas las calificaciones recibidas por un usuario específico.

*   **`POST /reputation/rate`**
    *   **Descripción:** Permite a un comprador calificar la transacción realizada en una venta registrada.
    *   **Cuerpo de la Petición (JSON):**
        ```json
        {
          "calificadorId": "id_comprador",
          "saleId": "id_venta",
          "estrellas": 5, 
          "criterio": "Puntualidad y honestidad en el peso",
          "comentario": "Excelente ganado, muy buena atención del vendedor."
        }
        ```
        *Nota: Las estrellas deben estar en el rango de 1 a 5.*
    *   **Detalle:** Al registrar una nueva calificación, se actualiza automáticamente el campo `reputacion_promedio` del usuario calificado en la tabla de usuarios.

---

## 🛠️ Comandos de Scripts Disponibles

Desde la **raíz del proyecto**, puedes ejecutar los siguientes scripts rápidos definidos en el `package.json` raíz:

- `npm run web:dev`: Arranca el servidor de desarrollo de Next.js (`apps/web`).
- `npm run api:dev`: Arranca el servidor de desarrollo de NestJS (`apps/api`) con recarga en caliente (`ts-node-dev`).
- `npm run shared:build`: Compila la librería compartida `packages/shared`.
- `npm run prisma:generate`: Regenera el cliente local de Prisma.
- `npm run prisma:migrate`: Aplica las migraciones de base de datos de Prisma localmente.
- `npm run prisma:studio`: Abre la consola interactiva visual de base de datos de Prisma (Prisma Studio) en tu navegador.
- `npm run web:build` / `npm run api:build`: Ejecutan la compilación de producción para el frontend y el backend respectivamente.

---

¡Disfruta hackeando en Vacomercio! Si tienes alguna duda con las variables de entorno o la base de datos, no dudes en preguntar al equipo.
