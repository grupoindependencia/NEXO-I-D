# Despliegue en GCP · NEXO I+D

Producción corre en **un único servicio Cloud Run** que sirve la API (`/api/*`) y el SPA en el mismo origen.
CI/CD por GitHub Actions con Workload Identity Federation (sin claves). Secretos en GitHub → inyectados como
variables de entorno de Cloud Run vía el workflow.

## Recursos en GCP

| Recurso | Valor |
|---|---|
| Proyecto de apps | `cii-apps-prod` (nº `821264474864`) |
| Proyecto de datos | `cii-data-prod` (nº `462492204480`) |
| Región | `us-central1` |
| Servicio Cloud Run | `nexoid` → `https://nexoid-821264474864.us-central1.run.app` |
| Imagen | `us-central1-docker.pkg.dev/cii-apps-prod/nexoid/app:<git-sha>` |
| Artifact Registry | repo `nexoid` (docker, us-central1) |
| Cloud SQL | instancia `tier-1` · Postgres 16 · `cii-data-prod:us-central1:tier-1` |
| Base de datos | `nexoid-db` · usuario `nexoid` |
| SA de despliegue (CI) | `github-nexoid-deploy@cii-apps-prod.iam.gserviceaccount.com` |
| SA de runtime | `nexoid-run@cii-apps-prod.iam.gserviceaccount.com` |
| WIF | pool `github-pool` / provider `github-oidc` (repo `grupoindependencia/NEXO-I-D`) |
| Job de seed | `nexoid-seed` (Cloud Run Job) |

## Secretos (GitHub → repo `grupoindependencia/NEXO-I-D`)

- `NEXOID_DB_PASSWORD` — password del usuario SQL `nexoid`.
- `NEXOID_JWT_SECRET` — secreto de firma del access token.
- `NEXOID_JWT_REFRESH_SECRET` — secreto de firma del refresh token.

El workflow compone `DATABASE_URL` con estos valores. Otras variables (CORS, expiraciones, BCRYPT_COST) están en
el `env:` del workflow (no son secretas).

## Flujo de despliegue

- **Automático**: cada `push` a `main` → build de la imagen, push a Artifact Registry y `gcloud run deploy`.
  Las migraciones Prisma se aplican solas al arrancar el contenedor (`prisma migrate deploy`, con advisory-lock).
- **Manual**: pestaña *Actions* → *Deploy NEXO I+D → Cloud Run* → *Run workflow*. Marcar `run_seed=true` para
  ejecutar el seed inicial/refresco de datos base sobre `nexoid-db`.

## Operación

```bash
# Estado del servicio
gcloud run services describe nexoid --region us-central1 --project cii-apps-prod

# Logs en vivo
gcloud run services logs tail nexoid --region us-central1 --project cii-apps-prod

# Health
curl https://nexoid-821264474864.us-central1.run.app/api/health   # {"ok":true,...}

# Re-ejecutar el seed (idempotente)
gcloud run jobs execute nexoid-seed --region us-central1 --project cii-apps-prod --wait

# Rollback a una revisión anterior
gcloud run services update-traffic nexoid --region us-central1 --project cii-apps-prod \
  --to-revisions <REVISION>=100
```

## Credenciales iniciales (tras el seed)

- `rodrigo.solis@cindependencia.cl` / `Independencia2026`
- `lbarrera@cindependencia.cl` / `Independencia2026`

> Cambiar la contraseña tras el primer acceso. La instancia Cloud SQL es **compartida**; el usuario `nexoid`
> tiene privilegios de `cloudsqlsuperuser` (default de Cloud SQL) y opera sobre `nexoid-db`.
