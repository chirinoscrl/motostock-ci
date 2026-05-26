# Configuración de Branch Protection en `main`

Esta regla convierte el pipeline CI de **cosmético** a **bloqueante**: ningún
commit puede llegar a `main` si el workflow no está verde.

> Requiere permisos de **Admin** en el repositorio. Solo puede hacerse una vez
> que el repo exista en GitHub y al menos un workflow haya corrido.

## Pasos vía interfaz web

1. Subir el repo a GitHub (`git push -u origin main`).
2. Hacer al menos un commit a `main` para que el workflow corra al menos una vez
   y GitHub conozca el nombre del check.
3. Ir a **Settings → Branches → Branch protection rules → Add rule**.
4. **Branch name pattern**: `main`
5. Activar:
   - ✅ **Require a pull request before merging**
     - Required approvals: `0` (proyecto individual) o `1` (si trabajas con alguien)
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
     - En **Status checks that are required**, buscar y seleccionar: `build-and-test`
   - ✅ **Require conversation resolution before merging**
   - ✅ **Do not allow bypassing the above settings** (incluido admins)
6. **Create** / **Save changes**.

## Pasos vía `gh` CLI (alternativa)

```bash
gh api -X PUT repos/OWNER/REPO/branches/main/protection \
  -F required_status_checks.strict=true \
  -F required_status_checks.contexts[]=build-and-test \
  -F enforce_admins=true \
  -F required_pull_request_reviews.required_approving_review_count=0 \
  -F required_pull_request_reviews.dismiss_stale_reviews=true \
  -F restrictions= \
  -F allow_force_pushes=false \
  -F allow_deletions=false
```

Sustituir `OWNER/REPO`. Requiere tener `gh` autenticado con scope `repo`.

## Verificación

Crear una PR con un commit que rompa los tests (por ejemplo, cambiar el
`expect(...)` de `health.controller.spec.ts`). El botón **Merge** debería
quedar deshabilitado hasta que el workflow pase o se revierta el cambio.

## Buenas prácticas adicionales (opcionales)

- Activar **Require signed commits** si manejas claves GPG.
- Activar **Require linear history** para forzar `rebase` en lugar de `merge`
  commits → historial más limpio.
- Para `develop`: aplicar la misma regla con menos restricciones (sin requerir
  PR si trabajas solo).
