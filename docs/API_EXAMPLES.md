# 💻 Ejemplos de Uso del Backend API

## Uso desde TypeScript/React

### 1. Importar el servicio
```typescript
import { itemsApi } from '@/lib/api-client';
```

### 2. Crear un Item

```typescript
// Forma simple
try {
  const response = await itemsApi.createItem({
    name: 'Pollo Congelado',
    description: 'Pechugas de pollo 1kg',
    freezerBox: 'Compartimento 1',
    freezerId: 'freezer1',
    // photoUrl es opcional
  });
  
  if (response.success) {
    console.log('Item creado:', response.data);
  } else {
    console.error('Error:', response.error);
  }
} catch (error) {
  console.error('Error de red:', error);
}
```

### 3. Obtener Items

```typescript
// Todos los items del usuario
try {
  const response = await itemsApi.getItems();
  if (response.success) {
    const items = response.data; // FoodItem[]
    items.forEach(item => {
      console.log(item.name, item.description);
    });
  }
} catch (error) {
  console.error('Error:', error);
}

// Items de un freezer específico
try {
  const response = await itemsApi.getItems('freezer1');
  if (response.success) {
    console.log(`Items en freezer1:`, response.data.length);
  }
} catch (error) {
  console.error('Error:', error);
}
```

### 4. Obtener un Item Específico

```typescript
try {
  const response = await itemsApi.getItem('abc123');
  if (response.success) {
    const item = response.data;
    console.log(`Item: ${item.name}`);
    console.log(`Descripción: ${item.description}`);
    console.log(`Ubicación: ${item.freezerBox}`);
    console.log(`Foto: ${item.photoUrl}`);
    console.log(`Congelado el: ${item.frozenDate}`);
    console.log(`Creado el: ${item.createdAt}`);
    console.log(`Actualizado el: ${item.updatedAt}`);
  } else {
    console.error('Item no encontrado:', response.error);
  }
} catch (error) {
  console.error('Error:', error);
}
```

### 5. Actualizar un Item

```typescript
try {
  const response = await itemsApi.updateItem('abc123', {
    name: 'Pollo Orgánico Congelado',
    description: 'Pechugas de pollo orgánico 2kg',
    freezerBox: 'Compartimento 2',
    // photoUrl es opcional
  });
  
  if (response.success) {
    console.log('Item actualizado:', response.data);
  } else {
    console.error('Error:', response.error);
  }
} catch (error) {
  console.error('Error:', error);
}
```

### 6. Eliminar un Item

```typescript
try {
  const response = await itemsApi.deleteItem('abc123');
  
  if (response.success) {
    console.log('Item eliminado:', response.data.id);
  } else {
    console.error('Error:', response.error);
  }
} catch (error) {
  console.error('Error:', error);
}
```

## Ejemplos en Componentes React

### Componente con Carga de Items

```typescript
'use client';
import { useEffect, useState } from 'react';
import { itemsApi } from '@/lib/api-client';
import { FoodItem } from '@/lib/types';

export function MyFreezerItems() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const response = await itemsApi.getItems('freezer1');
        if (response.success) {
          setItems(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Mis Items ({items.length})</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Ubicación: {item.freezerBox}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Componente con Crear Item

```typescript
'use client';
import { useState } from 'react';
import { itemsApi } from '@/lib/api-client';

export function AddItemForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    freezerBox: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await itemsApi.createItem({
        ...formData,
        freezerId: 'freezer1', // O el freezer seleccionado
      });

      if (response.success) {
        setSuccess(true);
        setFormData({ name: '', description: '', freezerBox: '' });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>¡Item creado!</div>}

      <input
        type="text"
        placeholder="Nombre del item"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <textarea
        placeholder="Descripción"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Ubicación (ej: Compartimento 1)"
        value={formData.freezerBox}
        onChange={(e) => setFormData({ ...formData, freezerBox: e.target.value })}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Crear Item'}
      </button>
    </form>
  );
}
```

### Componente con Actualizar Item

```typescript
'use client';
import { useEffect, useState } from 'react';
import { itemsApi } from '@/lib/api-client';

export function EditItemForm({ itemId }: { itemId: string }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    freezerBox: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const response = await itemsApi.getItem(itemId);
        if (response.success) {
          setFormData({
            name: response.data.name,
            description: response.data.description,
            freezerBox: response.data.freezerBox,
          });
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [itemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      const response = await itemsApi.updateItem(itemId, formData);

      if (response.success) {
        alert('¡Item actualizado!');
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />

      <input
        type="text"
        value={formData.freezerBox}
        onChange={(e) => setFormData({ ...formData, freezerBox: e.target.value })}
        required
      />

      <button type="submit" disabled={saving}>
        {saving ? 'Guardando...' : 'Actualizar'}
      </button>
    </form>
  );
}
```

### Componente con Eliminar Item

```typescript
'use client';
import { useState } from 'react';
import { itemsApi } from '@/lib/api-client';

export function DeleteItemButton({ itemId, onDeleted }: { itemId: string; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este item?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await itemsApi.deleteItem(itemId);

      if (response.success) {
        alert('Item eliminado');
        onDeleted();
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Eliminando...' : 'Eliminar'}
      </button>
    </div>
  );
}
```

## Errores Comunes y Soluciones

### Error: "Invalid input data"
**Causa**: Uno de los campos requeridos está vacío
```typescript
// ❌ Mal
await itemsApi.createItem({
  name: '',  // Error: vacío
  description: 'Test',
  freezerBox: 'Box',
  freezerId: 'freezer1',
});

// ✅ Bien
await itemsApi.createItem({
  name: 'Item',
  description: 'Test',
  freezerBox: 'Box',
  freezerId: 'freezer1',
});
```

### Error: "You must be logged in"
**Causa**: El usuario no está autenticado
```typescript
// Verificar antes de llamar a la API
import { auth } from '@/lib/firebase';

if (!auth.currentUser) {
  console.error('No estás autenticado');
  return;
}

// Ahora sí puedes llamar a la API
await itemsApi.getItems();
```

### Error: "Invalid authentication token"
**Causa**: El token JWT ha expirado
```typescript
// Los tokens expiran después de 1 hora
// Solución: Vuelve a autenticarte
// La biblioteca de Firebase lo maneja automáticamente
```

### Error: "You do not have access to this item"
**Causa**: Intentas acceder a un item de otro usuario
```typescript
// Los items solo son accesibles por el usuario que los creó
// Cada item tiene un userId que debe coincidir con tu UID
```

## Tips y Buenas Prácticas

1. **Siempre maneja errores**
```typescript
try {
  const response = await itemsApi.getItems();
  if (!response.success) {
    console.error('Error:', response.error);
    // Mostrar error al usuario
  }
} catch (error) {
  console.error('Error de red:', error);
}
```

2. **Valida antes de enviar**
```typescript
if (!name.trim()) {
  setError('El nombre no puede estar vacío');
  return;
}

await itemsApi.createItem({ name: name.trim(), ... });
```

3. **Usa loading states**
```typescript
const [loading, setLoading] = useState(false);

try {
  setLoading(true);
  await itemsApi.createItem(data);
} finally {
  setLoading(false);
}
```

4. **Verifica autenticación**
```typescript
import { auth } from '@/lib/firebase';

if (!auth.currentUser) {
  navigate('/login');
  return;
}
```

---

¡Listo para usar! 🚀
