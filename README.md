# Proyecto Centro de Masajes – Despliegue

## Descripción

Este proyecto corresponde a la aplicación **Centro de Masajes**, que permite gestionar reservas, clientes y servicios.

* **Backend:** Spring Boot
* **Frontend:** React
* **Base de datos:** MySQL en Amazon RDS
* **Despliegue:** Backend en Render, Frontend en Netlify

## Prerrequisitos

* Cuenta en **AWS** con RDS.
* Cuenta en **Render** para backend.
* Cuenta en **Netlify** para frontend.
* Docker (opcional, para pruebas locales).
* MySQL Workbench (para importar la base de datos).

## 1️ Base de datos (RDS)

1. Crear una instancia MySQL en AWS RDS.
2. Configurar usuario, contraseña y acceso público (Security Group).
3. Importar la base de datos desde el dump local `bdrelaxtotal.sql`:

**Opción Workbench:**

* Conectar Workbench al RDS.
* Server → Data Import → Import from Self-Contained File → seleccionar `bdrelaxtotal.sql` → Start Import.

**Opción terminal:**

```bash
mysql -h <endpoint_RDS> -P 3306 -u <usuario> -p < bdrelaxtotal.sql
```

4. Verificar la creación:

```sql
SHOW DATABASES;
USE centro_masajes;
SHOW TABLES;
```

## 2️ Backend (Spring Boot en Render)

### Dockerfile utilizado:

```dockerfile
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
```

### Despliegue en Render:

1. Crear un nuevo **Web Service** en Render.
2. Conectar el repositorio Git del backend.
3. Configurar **Environment Variables**:

   * `SPRING_DATASOURCE_URL=jdbc:mysql://<endpoint_RDS>:3306/centro_masajes`
   * `SPRING_DATASOURCE_USERNAME=<usuario_RDS>`
   * `SPRING_DATASOURCE_PASSWORD=<contraseña_RDS>`
   * `PORT` (Render asigna automáticamente).
4. Render asigna un **puerto interno** (ej: 10000). La app debe leerlo:

```properties
server.port=${PORT:8080}
```

5. Hacer **Manual Deploy / Restart** si la app estaba corriendo antes de la DB.

## 3 Frontend (React en Netlify)

1. Crear un sitio en Netlify y conectar el repositorio del frontend.
2. Configurar la **URL del backend** en los servicios de la app:

```js
const BASE_URL = "https://mi-backend.onrender.com";
```

3. Deploy automático o manual desde Netlify.
4. El frontend no requiere puerto; Netlify sirve la app en su URL pública.

## 4 Pruebas

1. Acceder al frontend en Netlify.
2. Probar funcionalidades de login y reservas.
3. Verificar logs del backend en Render para asegurar conexión con RDS.

## 5 Notas importantes

* Render maneja puertos internos dinámicos, no modificar `EXPOSE` en el Dockerfile afecta solo pruebas locales.
* AWS RDS no elimina instancias por inactividad; si la DB desaparece, normalmente fue eliminada manualmente.
* Para futuras copias de seguridad, exportar la base de datos y mantener snapshots en RDS.
