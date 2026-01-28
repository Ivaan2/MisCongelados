# Backend CRUD API - Documentación

## 🔒 Descripción General

Se ha implementado un backend robusto con Next.js API Routes que actúa como intermediario seguro entre el frontend y Firestore. El backend valida todos los datos antes de guardarlos en la base de datos.

## 🛠️ Configuración Requerida

### 1. Instalar Dependencias

```bash
npm install firebase-admin
```

### 2. Configurar Variables de Entorno

Copia `.env.local.example` a `.env.local` y completa con tus credenciales:

```bash
cp .env.local.example .env.local
```

**Obtener credenciales de Firebase Admin SDK:**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** (engranaje) → **Service Accounts**
4. Haz clic en **Generate New Private Key**
5. Se descargará un archivo JSON. Extrae:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (mantén los `\n` como están)

### 3. Configurar Firestore Rules de Seguridad

Reemplaza las reglas en Firebase Console → Firestore Database → Rules:

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

## 📡 API Endpoints

### 1. **Crear Item** `POST /api/items`

Crea un nuevo item en el congelador.

**Headers:**
```
Authorization: Bearer {idToken}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Pollo Congelado",
  "description": "Pechugas de pollo 1kg",
  "freezerBox": "Compartimento 1",
  "freezerId": "freezer1",
  "photoUrl": "https://example.com/image.jpg"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "Pollo Congelado",
    "description": "Pechugas de pollo 1kg",
    "freezerBox": "Compartimento 1",
    "freezerId": "freezer1",
    "photoUrl": "https://example.com/image.jpg",
    "userId": "user-uid",
    "frozenDate": "2026-01-28T10:00:00Z",
    "createdAt": "2026-01-28T10:00:00Z"
  },
  "message": "Item created successfully"
}
```

**Errores Posibles:**
- `400`: Datos inválidos (nombre vacío, descripción vacía, etc.)
- `401`: No autenticado
- `500`: Error del servidor

---

### 2. **Obtener Items** `GET /api/items`

Obtiene todos los items del usuario (opcionalmente filtrados por freezer).

**Query Parameters:**
- `freezerId` (opcional): Filtrar por ID de congelador

**Headers:**
```
Authorization: Bearer {idToken}
```

**Ejemplos:**
```
GET /api/items
GET /api/items?freezerId=freezer1
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "name": "Pollo Congelado",
      "description": "Pechugas de pollo 1kg",
      "freezerBox": "Compartimento 1",
      "freezerId": "freezer1",
      "photoUrl": "https://example.com/image.jpg",
      "userId": "user-uid",
      "frozenDate": "2026-01-28T10:00:00Z",
      "createdAt": "2026-01-28T10:00:00Z",
      "updatedAt": "2026-01-28T10:00:00Z"
    }
  ],
  "message": "Retrieved 1 items"
}
```

---

### 3. **Obtener Item Individual** `GET /api/items/[id]`

Obtiene un item específico.

**Headers:**
```
Authorization: Bearer {idToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "Pollo Congelado",
    "description": "Pechugas de pollo 1kg",
    "freezerBox": "Compartimento 1",
    "freezerId": "freezer1",
    "photoUrl": "https://example.com/image.jpg",
    "userId": "user-uid",
    "frozenDate": "2026-01-28T10:00:00Z",
    "createdAt": "2026-01-28T10:00:00Z",
    "updatedAt": "2026-01-28T10:00:00Z"
  }
}
```

**Errores Posibles:**
- `400`: ID inválido
- `401`: No autenticado
- `404`: Item no encontrado
- `403`: Acceso denegado (no es tu item)

---

### 4. **Actualizar Item** `PUT /api/items/[id]`

Actualiza un item existente.

**Headers:**
```
Authorization: Bearer {idToken}
Content-Type: application/json
```

**Body (todos los campos son opcionales):**
```json
{
  "name": "Pollo Orgánico Congelado",
  "description": "Pechugas de pollo orgánico 1kg",
  "freezerBox": "Compartimento 2",
  "photoUrl": "https://example.com/new-image.jpg"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "Pollo Orgánico Congelado",
    "description": "Pechugas de pollo orgánico 1kg",
    "freezerBox": "Compartimento 2",
    "freezerId": "freezer1",
    "photoUrl": "https://example.com/new-image.jpg",
    "userId": "user-uid",
    "frozenDate": "2026-01-28T10:00:00Z",
    "createdAt": "2026-01-28T10:00:00Z",
    "updatedAt": "2026-01-28T10:05:00Z"
  },
  "message": "Item updated successfully"
}
```

---

### 5. **Eliminar Item** `DELETE /api/items/[id]`

Elimina un item existente.

**Headers:**
```
Authorization: Bearer {idToken}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "abc123"
  },
  "message": "Item deleted successfully"
}
```

---

## ✅ Validaciones Implementadas

El backend valida automáticamente:

1. **Nombre del Item:**
   - ✓ No puede ser null o undefined
   - ✓ No puede estar vacío
   - ✓ No puede ser solo espacios
   - ✗ Rechaza: `""`, `null`, `"   "`, `undefined`

2. **Descripción:**
   - ✓ No puede ser null o undefined
   - ✓ No puede estar vacío
   - ✓ No puede ser solo espacios
   - ✗ Rechaza: `""`, `null`, `"   "`, `undefined`

3. **Freezer Box:**
   - ✓ No puede ser null o undefined
   - ✓ No puede estar vacío
   - ✓ No puede ser solo espacios
   - ✗ Rechaza: `""`, `null`, `"   "`, `undefined`

4. **Photo URL (Opcional):**
   - ✓ Si se proporciona, debe ser una URL válida
   - ✓ Si está vacío o null, se ignora
   - ✗ Rechaza: URLs inválidas

5. **Autenticación:**
   - ✓ Verifica token JWT válido
   - ✗ Rechaza: Sin token, token inválido, token expirado

6. **Autorización:**
   - ✓ El usuario solo puede acceder a sus propios items
   - ✗ Rechaza: Intentos de acceder a items de otros usuarios

---

## 🔐 Seguridad

### Cliente-Side:
- ✓ El frontend envía tokens JWT válidos
- ✓ Las credenciales de Firebase nunca se exponen

### Servidor-Side:
- ✓ Verifica tokens JWT con Firebase Admin SDK
- ✓ Valida todos los datos antes de guardar
- ✓ Rechaza datos nulos/vacíos
- ✓ Verifica que los usuarios solo accedan a sus propios datos
- ✓ Las credenciales de Admin SDK están en variables de entorno

---

## 🧪 Ejemplo de Uso desde Frontend

Usa el servicio `itemsApi` que ya está configurado:

```typescript
import { itemsApi } from '@/lib/api-client';

// Crear item
const response = await itemsApi.createItem({
  name: 'Pollo Congelado',
  description: 'Pechugas de pollo 1kg',
  freezerBox: 'Compartimento 1',
  freezerId: 'freezer1',
  photoUrl: 'https://example.com/image.jpg',
});

// Obtener items
const items = await itemsApi.getItems('freezer1');

// Obtener item específico
const item = await itemsApi.getItem('abc123');

// Actualizar item
await itemsApi.updateItem('abc123', {
  name: 'Pollo Orgánico Congelado',
  freezerBox: 'Compartimento 2',
});

// Eliminar item
await itemsApi.deleteItem('abc123');
```

---

## 📋 Estructura de Archivos del Backend

```
src/
├── app/
│   └── api/
│       └── items/
│           ├── route.ts         # GET /api/items, POST /api/items
│           └── [id]/
│               └── route.ts     # GET, PUT, DELETE /api/items/[id]
├── lib/
│   ├── firebase-admin.ts        # Inicialización Firebase Admin
│   ├── validation.ts            # Funciones de validación
│   ├── auth.ts                  # Verificación de tokens JWT
│   ├── api-response.ts          # Respuestas estandarizadas
│   └── api-client.ts            # Cliente HTTP para frontend
└── ...
```

---

## 🐛 Troubleshooting

### Error: "Invalid authentication token"
- Verifica que estés enviando el header `Authorization: Bearer {token}`
- Comprueba que el token no haya expirado
- Asegúrate de estar autenticado en Firebase

### Error: "You do not have access to this item"
- Verificas que el item pertenece a tu usuario
- Los ítems solo son accesibles por el usuario que los creó

### Error: "Invalid input data"
- Verifica que `name`, `description` y `freezerBox` no estén vacíos
- Comprueba que no haya espacios en blanco solamente
- Si envías `photoUrl`, debe ser una URL válida

### Las variables de entorno no se cargan
- Crea el archivo `.env.local` (no `.env`)
- Reinicia el servidor: `npm run dev`
- Verifica que las claves sean exactas: `FIREBASE_PROJECT_ID`, etc.

---

## ✨ Próximas Mejoras (Opcional)

- [ ] Agregar paginación a GET /api/items
- [ ] Agregar búsqueda de items por nombre
- [ ] Implementar rate limiting
- [ ] Agregar logging de auditoría
- [ ] Implementar soft delete
- [ ] Agregar versionado de items
