# ALQUIPC

Sistema web de facturación para el alquiler de equipos de cómputo portátiles.

## Descripción

ALQUIPC es una aplicación web desarrollada con Django para gestionar el alquiler de equipos de cómputo portátiles y generar las respectivas facturas.

El sistema permite registrar clientes, generar identificadores únicos, registrar alquileres, calcular automáticamente los valores según la modalidad del servicio, aplicar descuentos por días adicionales y consultar el historial de facturas.

El proyecto fue desarrollado como ejercicio académico del programa **Análisis y Desarrollo de Software (ADSO) del SENA**.

## Tecnologías utilizadas

- Python
- Django
- HTML5
- CSS3
- JavaScript
- SQLite
- Visual Studio Code

## Funcionalidades

- Registro de clientes.
- Generación automática del código de cliente.
- Validación de clientes registrados mediante correo electrónico.
- Registro de alquileres.
- Cálculo automático del valor del alquiler.
- Incremento del 5% para alquileres fuera de la ciudad.
- Descuento del 5% para alquileres dentro del establecimiento.
- Descuento del 2% por cada día adicional.
- Límite máximo del 10% para el descuento por días adicionales.
- Generación de facturas.
- Consulta del historial de facturas.
- Búsqueda de facturas por número, cliente, código o correo electrónico.
- Preparación del correo electrónico con los datos de la factura.
- Panel administrativo de Django.
- Almacenamiento de la información en una base de datos SQLite.

## Reglas de negocio

El sistema utiliza las siguientes reglas para calcular el valor de los alquileres:

- El valor del alquiler es de **$35.000 por equipo y por día**.
- Se deben alquilar como mínimo **2 equipos**.
- Para alquileres **dentro de la ciudad** no se aplica ningún ajuste.
- Para alquileres **fuera de la ciudad** se aplica un incremento del **5%**.
- Para alquileres **dentro del establecimiento** se aplica un descuento del **5%**.
- Cada día adicional genera un descuento del **2%** sobre el valor correspondiente a los días adicionales.
- El descuento acumulado por días adicionales tiene un límite máximo del **10%**.

### Ejemplo de cálculo

Para un alquiler de:

- 2 equipos
- 5 días iniciales
- 2 días adicionales
- Dentro de la ciudad

El cálculo es:

**Valor inicial:**

2 × 5 × $35.000 = $350.000

**Valor días adicionales:**

2 × 2 × $35.000 = $140.000

**Descuento por días adicionales:**

4% de $140.000 = $5.600

**Valor adicional después del descuento:**

$140.000 - $5.600 = $134.400

**Total:**

$350.000 + $134.400 = **$484.400**

## Estructura del proyecto

La estructura principal del proyecto es:

```text
ALQUIPC/
│
├── facturApp/
│   ├── migrations/
│   ├── static/
│   │   └── facturApp/
│   │       ├── css/
│   │       │   └── estilos.css
│   │       └── js/
│   │           └── facturacion.js
│   │
│   ├── templates/
│   │   └── facturApp/
│   │       └── inicio.html
│   │
│   ├── admin.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
│
├── venv/
├── db.sqlite3
├── manage.py
├── requirements.txt
├── README.md
└── .gitignore
```

## Requisitos

Para ejecutar el proyecto se necesita:

- Python 3
- Django
- Visual Studio Code
- Un navegador web actualizado

## Instalación

### 1. Descargar o clonar el proyecto

Descargar el proyecto desde el repositorio o copiarlo en el equipo donde se desea ejecutar.

### 2. Crear el entorno virtual

Abrir una terminal en la carpeta principal del proyecto y ejecutar:

```bash
python -m venv venv
```

### 3. Activar el entorno virtual

En Windows:

```powershell
venv\Scripts\activate
```

Cuando el entorno esté activo, aparecerá `(venv)` al comienzo de la línea de la terminal.

### 4. Instalar las dependencias

Ejecutar:

```powershell
pip install -r requirements.txt
```

### 5. Realizar las migraciones

Ejecutar:

```powershell
python manage.py migrate
```

### 6. Ejecutar el servidor

Ejecutar:

```powershell
python manage.py runserver
```

### 7. Abrir la aplicación

Abrir el siguiente enlace en el navegador:

```text
http://127.0.0.1:8000/
```

## Panel administrativo

El proyecto utiliza el sistema administrativo de Django para gestionar la información almacenada.

El panel administrativo se encuentra en:

```text
http://127.0.0.1:8000/admin/
```

Para ingresar se debe contar con un usuario administrador de Django.

## Pruebas realizadas

Se realizaron diferentes pruebas para verificar el funcionamiento de las principales reglas de negocio.

| Caso de prueba | Resultado esperado |
|---|---:|
| 2 equipos × 1 día, dentro de la ciudad | $70.000 |
| 2 equipos × 5 días, dentro de la ciudad | $350.000 |
| 2 equipos × 5 días, fuera de la ciudad | $367.500 |
| 2 equipos × 5 días, dentro del establecimiento | $332.500 |
| 2 equipos × 5 días + 2 días adicionales | $484.400 |
| Menos de 2 equipos | No permitido |
| Cantidad de días menor a 1 | No permitido |
| Modalidad sin seleccionar | No permitido |
| Días adicionales negativos | No permitido |
| Correo de cliente ya registrado | No permitido |
| Más de 5 días adicionales | Descuento máximo limitado al 10% |

## Base de datos

El proyecto utiliza **SQLite** como sistema de gestión de base de datos durante el desarrollo.

La base de datos se encuentra en el archivo:

```text
db.sqlite3
```

La aplicación maneja principalmente las siguientes entidades:

### Cliente

Almacena la información básica del cliente:

- Nombre.
- Correo electrónico.
- Fecha de registro.
- Código de cliente.

### Alquiler

Almacena la información relacionada con el alquiler:

- Cliente.
- Cantidad de equipos.
- Días iniciales.
- Días adicionales.
- Modalidad del alquiler.

### Factura

Almacena la información correspondiente a la facturación:

- Alquiler asociado.
- Subtotal.
- Ajustes.
- Total.

## Identificación de clientes

Cada cliente recibe un código generado automáticamente por el sistema utilizando el siguiente formato:

```text
ALQ-000001
ALQ-000002
ALQ-000003
```

El número se genera a partir del identificador asignado por Django al cliente.

## Historial de facturas

El sistema cuenta con una sección de historial donde se pueden consultar las facturas registradas.

La búsqueda permite encontrar facturas utilizando:

- Número de factura.
- Nombre del cliente.
- Código del cliente.
- Correo electrónico.

## Correo electrónico

Después de generar una factura, el sistema permite preparar un correo electrónico con los datos principales de la factura.

El correo incluye:

- Nombre del cliente.
- Número de factura.
- Código del cliente.
- Cantidad de equipos.
- Días iniciales.
- Días adicionales.
- Modalidad.
- Valores calculados.
- Descuentos.
- Total de la factura.

El sistema utiliza el cliente de correo configurado en el equipo mediante un enlace `mailto`.

## Administración del proyecto

El proyecto utiliza Django para manejar:

- Modelos.
- Vistas.
- URLs.
- Plantillas.
- Base de datos.
- Panel administrativo.
- Migraciones.

La aplicación se encuentra organizada utilizando la arquitectura básica de Django.

## Consideraciones

El archivo `db.sqlite3` corresponde a la base de datos utilizada durante el desarrollo local.

El entorno virtual `venv` tampoco debe ser incluido en el repositorio, ya que las dependencias pueden instalarse mediante:

```powershell
pip install -r requirements.txt
```

Por esta razón, estos archivos y carpetas se encuentran incluidos en `.gitignore`.

## Autor

**Brayan Flórez García**

Proyecto académico desarrollado como parte del programa **Análisis y Desarrollo de Software (ADSO) del SENA**.