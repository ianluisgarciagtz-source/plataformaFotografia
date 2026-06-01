# Guía de Despliegue: GitHub a Vercel

## 📋 Requisitos Previos

✅ **Ya configurado en tu proyecto:**
- Node.js 18+ instalado
- pnpm como gestor de paquetes
- Vite como bundler (SPA compatible con Vercel)
- React 18.3.1
- TypeScript
- Todas las dependencias instaladas (`pnpm install`)
- `.gitignore` completo
- `vercel.json` configurado
- `package.json` optimizado

## 🚀 Pasos para Desplegar

### 1. Crear Repositorio en GitHub

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Fototrabajo platform"

# Renombrar rama a main (si es necesario)
git branch -M main

# Agregar remoto (reemplazar con tu URL)
git remote add origin https://github.com/tu-usuario/fototrabajo.git

# Pushear a GitHub
git push -u origin main
```

### 2. Conectar a Vercel

#### Opción A: A través del Dashboard de Vercel
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta
2. Click en "Add New..." → "Project"
3. Selecciona tu repositorio de GitHub
4. Vercel detectará automáticamente:
   - Framework: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
5. Configura las Environment Variables si es necesario (ver sección abajo)
6. Click en "Deploy"

#### Opción B: CLI de Vercel
```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Autenticarse con tu cuenta
vercel login

# Desplegar desde el directorio del proyecto
vercel
```

### 3. Configurar Variables de Entorno (si es necesario)

En el Dashboard de Vercel:
1. Ve a "Settings" → "Environment Variables"
2. Agrega las siguientes si usas PayPal u otras APIs:
   - `VITE_PAYPAL_CLIENT_ID`: Tu Client ID de PayPal
   - Cualquier otra variable que necesite tu app

**Nota:** Las variables debe empezar con `VITE_` para ser accesibles en el cliente.

## ✅ Verificación Post-Deploy

- Tu sitio estará disponible en: `https://tu-proyecto.vercel.app`
- Vercel generará un dominio automático
- Puedes configurar un dominio personalizado en Settings → Domains

## 🔄 Futuros Despliegues

Simplemente haz `git push` a main:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel redesplegará automáticamente en cada push.

## ⚠️ Notas Importantes

1. **Build Time**: Tu proyecto tardará ~2-3 minutos en construir en Vercel
2. **Límites Free**: Vercel tiene un plan gratuito con limitaciones generosas
3. **API Backend**: Este es un Frontend SPA. Si necesitas backend:
   - Usa Vercel Serverless Functions (carpeta `/api`)
   - O crea un servidor separado (Node.js, Python, etc.)
4. **CORS**: Si consumes APIs externas, asegúrate de configurar CORS correctamente

## 📝 Archivo package.json Actualizado

Tu `package.json` ya tiene:
```json
{
  "name": "fototrabajo",
  "scripts": {
    "dev": "pnpm dev",      // Para desarrollo local
    "build": "vite build",   // Para producción
    "preview": "vite preview" // Ver build local
  }
}
```

## 🆘 Troubleshooting

**Error: "Command failed: pnpm build"**
- Ejecuta `pnpm build` localmente para ver el error real
- Verifica que todos los archivos están en git

**Error: "Module not found"**
- Asegúrate de tener todas las dependencias en `package.json`
- Ejecuta `pnpm install` y `git push` nuevamente

**Sitio en blanco después del deploy**
- Verifica la consola del navegador (F12) para errores
- Revisa que no haya conflictos de rutas en tu SPA

## 📚 Recursos Útiles

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Alternative](https://pages.github.com/)
