# 🚀 Guía de Implementación del Backend - Pasos Rápidos

## ✅ Lo que se ha hecho

Se ha construido un backend robusto con Next.js API Routes que:
- ✅ Valida que no lleguen valores nulos o vacíos a la base de datos
- ✅ Implementa CRUD completo (Create, Read, Update, Delete)
- ✅ Verifica autenticación con tokens JWT de Firebase
- ✅ Protege los datos del usuario (solo puede acceder a sus propios items)
- ✅ Maneja errores de forma estandarizada
- ✅ Rechaza URLs inválidas en campos opcionales

## 📋 Pasos de Configuración

### Paso 1: Instalar Dependencias
```bash
cd /home/ivanmoralesmellado/projects/congelador_digital_app
npm install firebase-admin
```

### Paso 2: Configurar Variables de Entorno

#### 2.1 Crear archivo `.env.local`
```bash
cp .env.local.example .env.local
```

#### 2.2 Obtener credenciales de Firebase
1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **⚙️ Project Settings** (esquina superior derecha)
4. Haz clic en la pestaña **Service Accounts**
5. Haz clic en **Generate New Private Key**
6. Se descargará un archivo JSON

#### 2.3 Completar `.env.local`
Abre el archivo JSON descargado y extrae estos valores:

```bash
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=tu-email@tu-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMUltilinea...KeyContent...\n-----END PRIVATE KEY-----\n"
```

**⚠️ IMPORTANTE:**
- El `FIREBASE_PRIVATE_KEY` es una cadena multilinea. Cópialo exactamente como aparece en el JSON
- Asegúrate de que los `\n` se mantengan como caracteres literales
- Nunca hagas commit de `.env.local` (ya está en `.gitignore`)

### Paso 3: Configurar Firestore Rules de Seguridad

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database** en el menú izquierdo
4. Haz clic en la pestaña **Rules**
5. Reemplaza el contenido con:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir solo operaciones autenticadas
    match /foodItems/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Haz clic en **Publish**

### Paso 4: Verificar la Configuración

```bash
npm run dev
```

La aplicación debería iniciarse sin errores de compilación.

## 🏗️ Estructura del Backend

```
src/app/api/items/
├── route.ts              # POST /api/items (crear)
│                         # GET /api/items (obtener todos)
└── [id]/
    └── route.ts          # GET /api/items/[id] (obtener uno)
                          # PUT /api/items/[id] (actualizar)
                          # DELETE /api/items/[id] (eliminar)

src/lib/
├── firebase-admin.ts     # Inicialización con Admin SDK
├── validation.ts         # Funciones de validación robustas
├── auth.ts              # Verificación de tokens JWT
├── api-response.ts      # Respuestas estandarizadas
├── api-client.ts        # Cliente tipado para el frontend
└── types.ts             # Tipos TypeScript
```

## 🧪 Pruebas con Postman/Insomnia

### 1. Obtener Token (desde la consola del navegador)
En el navegador, cuando estés autenticado:
```javascript
const token = await firebase.auth().currentUser.getIdToken();
console.log(token);
```

### 2. Crear Item
```
POST /api/items
Authorization: Bearer {tu-token}
Content-Type: application/json

{
  "name": "Pollo Congelado",
  "description": "Pechugas de pollo 1kg",
  "freezerBox": "Compartimento 1",
  "freezerId": "freezer1"
}
```

### 3. Obtener Items
```
GET /api/items?freezerId=freezer1
Authorization: Bearer {tu-token}
```

### 4. Actualizar Item
```
PUT /api/items/{id}
Authorization: Bearer {tu-token}
Content-Type: application/json

{
  "name": "Pollo Orgánico"
}
```

### 5. Eliminar Item
```
DELETE /api/items/{id}
Authorization: Bearer {tu-token}
```

## ❌ Validaciones que Rechaza

El backend **rechaza automáticamente**:

1. **Nombres vacíos**: `""`, `null`, `undefined`, `"   "` (solo espacios)
2. **Descripciones vacías**: `""`, `null`, `undefined`, `"   "`
3. **Freezer Box vacío**: `""`, `null`, `undefined`, `"   "`
4. **URLs inválidas**: `"not-a-url"`, `"http://"`
5. **Sin autenticación**: Request sin header `Authorization`
6. **Tokens expirados**: Tokens JWT no válidos
7. **Acceso no autorizado**: Intentar acceder a items de otros usuarios

## 🔑 Variables de Entorno Requeridas

```bash
# Firebase Admin SDK (REQUERIDO)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Firebase Web SDK (opcional, si usas cliente directo)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'firebase-admin'"
```bash
npm install firebase-admin
npm run dev
```

### Error: "FIREBASE_PROJECT_ID is not defined"
- Verifica que hayas creado el archivo `.env.local`
- Reinicia el servidor: `npm run dev`
- Comprueba que las variables sean exactamente iguales (mayúsculas importan)

### Error: "Invalid authentication token"
- El token JWT puede haber expirado
- Intenta volver a autenticarte
- Los tokens duran 1 hora

### Error: "You do not have access to this item"
- Verificas que el item pertenece a tu usuario autenticado
- Los items solo son accesibles por quien los creó

### El frontend no carga los items
- Verifica que hayas hecho login
- Abre la consola de desarrollo (F12) para ver errores
- Comprueba que el servidor esté corriendo sin errores

## ✨ Próximas Mejoras (Opcional)

- [ ] Agregar búsqueda de items
- [ ] Agregar paginación
- [ ] Implementar rate limiting
- [ ] Agregar logging de auditoría
- [ ] Crear un dashboard administrativo

## 📚 Documentación Completa

Para más detalles sobre los endpoints, validaciones y ejemplos:
👉 Ver `docs/BACKEND_API.md`

## ✅ Checklist Final

- [ ] Instalé `firebase-admin` con `npm install`
- [ ] Creé el archivo `.env.local` con las credenciales
- [ ] Configuré las Firestore Rules de seguridad
- [ ] Ejecuté `npm run dev` sin errores
- [ ] El frontend carga correctamente
- [ ] Puedo crear, leer, actualizar y eliminar items

¡Listo! 🎉
