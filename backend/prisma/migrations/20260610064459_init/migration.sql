-- CreateTable
CREATE TABLE "usuarios" (
    "usuario_id" SERIAL NOT NULL,
    "usuario_correo" VARCHAR(255) NOT NULL,
    "usuario_nombre" VARCHAR(255) NOT NULL,
    "usuario_password" VARCHAR(255),
    "usuario_departamento" VARCHAR(100),
    "usuario_rol" VARCHAR(50) NOT NULL,
    "usuario_cargo" VARCHAR(150),
    "usuario_activo" BOOLEAN NOT NULL DEFAULT true,
    "usuario_proveedor_auth" VARCHAR(50) NOT NULL DEFAULT 'local',
    "usuario_proveedor_id" VARCHAR(255),
    "usuario_fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_fecha_desactivacion" TIMESTAMP(3),
    "usuario_ultimo_login" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "refresh_token_id" SERIAL NOT NULL,
    "refresh_token_token" VARCHAR(500) NOT NULL,
    "refresh_token_expira" TIMESTAMP(3) NOT NULL,
    "refresh_token_revocado" BOOLEAN NOT NULL DEFAULT false,
    "usuario_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("refresh_token_id")
);

-- CreateTable
CREATE TABLE "proyectos" (
    "proyecto_id" SERIAL NOT NULL,
    "proyecto_codigo" VARCHAR(50) NOT NULL,
    "proyecto_nombre" VARCHAR(255) NOT NULL,
    "proyecto_descripcion" TEXT,
    "proyecto_estado" VARCHAR(50) NOT NULL DEFAULT 'activo',
    "proyecto_eyebrow" VARCHAR(255),
    "proyecto_subtitulo" TEXT,
    "proyecto_orden" INTEGER NOT NULL DEFAULT 0,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_by" INTEGER,
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("proyecto_id")
);

-- CreateTable
CREATE TABLE "protocolo_secciones" (
    "seccion_id" SERIAL NOT NULL,
    "seccion_codigo" VARCHAR(50) NOT NULL,
    "seccion_titulo" VARCHAR(255) NOT NULL,
    "seccion_subtitulo" TEXT,
    "seccion_contenido" JSONB,
    "seccion_orden" INTEGER NOT NULL DEFAULT 0,
    "seccion_visible" BOOLEAN NOT NULL DEFAULT true,
    "proyecto_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_by" INTEGER,
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "protocolo_secciones_pkey" PRIMARY KEY ("seccion_id")
);

-- CreateTable
CREATE TABLE "obras" (
    "obra_id" SERIAL NOT NULL,
    "obra_codigo" VARCHAR(50) NOT NULL,
    "obra_nombre" VARCHAR(255) NOT NULL,
    "obra_direccion" VARCHAR(500),
    "obra_ciudad" VARCHAR(100),
    "obra_latitud" DECIMAL(10,7),
    "obra_longitud" DECIMAL(10,7),
    "obra_estado" VARCHAR(50) NOT NULL DEFAULT 'activa',
    "obra_jefe_id" INTEGER,
    "proyecto_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_by" INTEGER,
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "obras_pkey" PRIMARY KEY ("obra_id")
);

-- CreateTable
CREATE TABLE "nodos" (
    "nodo_id" SERIAL NOT NULL,
    "nodo_mac" VARCHAR(17) NOT NULL,
    "nodo_nombre" VARCHAR(255) NOT NULL,
    "nodo_descripcion" TEXT,
    "nodo_ubicacion" VARCHAR(255),
    "nodo_latitud" DECIMAL(10,7),
    "nodo_longitud" DECIMAL(10,7),
    "nodo_repetidor" VARCHAR(100),
    "nodo_estado" VARCHAR(50) NOT NULL DEFAULT 'activo',
    "nodo_conexion" VARCHAR(50) NOT NULL DEFAULT 'desconocido',
    "nodo_ultimo_visto" TIMESTAMP(3),
    "nodo_firmware" VARCHAR(50),
    "nodo_intervalo_reporte" INTEGER NOT NULL DEFAULT 300,
    "obra_id" INTEGER NOT NULL,
    "proyecto_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_by" INTEGER,
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "nodos_pkey" PRIMARY KEY ("nodo_id")
);

-- CreateTable
CREATE TABLE "nodo_metricas" (
    "metrica_id" BIGSERIAL NOT NULL,
    "metrica_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metrica_rssi" INTEGER,
    "metrica_calidad" INTEGER,
    "metrica_canal" INTEGER,
    "metrica_ip" VARCHAR(45),
    "metrica_gateway" VARCHAR(45),
    "metrica_uptime" INTEGER,
    "metrica_reconexiones" INTEGER,
    "metrica_gw_ping_avg" INTEGER,
    "metrica_gw_loss" INTEGER,
    "metrica_inet_ping_avg" INTEGER,
    "metrica_inet_loss" INTEGER,
    "nodo_id" INTEGER NOT NULL,

    CONSTRAINT "nodo_metricas_pkey" PRIMARY KEY ("metrica_id")
);

-- CreateTable
CREATE TABLE "checklists_diarios" (
    "checklist_id" SERIAL NOT NULL,
    "checklist_fecha" DATE NOT NULL,
    "checklist_turno" VARCHAR(20) NOT NULL DEFAULT 'manana',
    "checklist_nodos_total" INTEGER NOT NULL,
    "checklist_nodos_ok" INTEGER NOT NULL,
    "checklist_nodos_alerta" INTEGER NOT NULL,
    "checklist_acciones" TEXT,
    "checklist_pendientes" TEXT,
    "checklist_observaciones" TEXT,
    "usuario_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checklists_diarios_pkey" PRIMARY KEY ("checklist_id")
);

-- CreateTable
CREATE TABLE "reportes_semanales" (
    "reporte_id" SERIAL NOT NULL,
    "reporte_semana_inicio" DATE NOT NULL,
    "reporte_semana_fin" DATE NOT NULL,
    "reporte_resumen" JSONB NOT NULL,
    "reporte_observaciones" TEXT,
    "reporte_acciones" TEXT,
    "reporte_estado" VARCHAR(50) NOT NULL DEFAULT 'borrador',
    "reporte_fecha_envio" TIMESTAMP(3),
    "proyecto_id" INTEGER NOT NULL,
    "autor_id" INTEGER NOT NULL,
    "validado_por" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reportes_semanales_pkey" PRIMARY KEY ("reporte_id")
);

-- CreateTable
CREATE TABLE "incidentes" (
    "incidente_id" SERIAL NOT NULL,
    "incidente_tipo" VARCHAR(100) NOT NULL,
    "incidente_severidad" VARCHAR(20) NOT NULL DEFAULT 'media',
    "incidente_estado" VARCHAR(20) NOT NULL DEFAULT 'abierto',
    "incidente_descripcion" TEXT NOT NULL,
    "incidente_resolucion" TEXT,
    "incidente_fecha_cierre" TIMESTAMP(3),
    "nodo_id" INTEGER NOT NULL,
    "obra_id" INTEGER NOT NULL,
    "responsable_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incidentes_pkey" PRIMARY KEY ("incidente_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usuario_correo_key" ON "usuarios"("usuario_correo");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_refresh_token_token_key" ON "refresh_tokens"("refresh_token_token");

-- CreateIndex
CREATE UNIQUE INDEX "proyectos_proyecto_codigo_key" ON "proyectos"("proyecto_codigo");

-- CreateIndex
CREATE UNIQUE INDEX "protocolo_secciones_proyecto_id_seccion_codigo_key" ON "protocolo_secciones"("proyecto_id", "seccion_codigo");

-- CreateIndex
CREATE UNIQUE INDEX "obras_obra_codigo_key" ON "obras"("obra_codigo");

-- CreateIndex
CREATE UNIQUE INDEX "nodos_nodo_mac_key" ON "nodos"("nodo_mac");

-- CreateIndex
CREATE INDEX "nodos_obra_id_idx" ON "nodos"("obra_id");

-- CreateIndex
CREATE INDEX "nodos_proyecto_id_idx" ON "nodos"("proyecto_id");

-- CreateIndex
CREATE INDEX "nodos_nodo_ultimo_visto_idx" ON "nodos"("nodo_ultimo_visto");

-- CreateIndex
CREATE INDEX "nodo_metricas_nodo_id_metrica_timestamp_idx" ON "nodo_metricas"("nodo_id", "metrica_timestamp");

-- CreateIndex
CREATE INDEX "checklists_diarios_checklist_fecha_idx" ON "checklists_diarios"("checklist_fecha");

-- CreateIndex
CREATE UNIQUE INDEX "checklists_diarios_checklist_fecha_checklist_turno_usuario__key" ON "checklists_diarios"("checklist_fecha", "checklist_turno", "usuario_id");

-- CreateIndex
CREATE INDEX "reportes_semanales_proyecto_id_reporte_semana_inicio_idx" ON "reportes_semanales"("proyecto_id", "reporte_semana_inicio");

-- CreateIndex
CREATE INDEX "incidentes_incidente_estado_idx" ON "incidentes"("incidente_estado");

-- CreateIndex
CREATE INDEX "incidentes_nodo_id_idx" ON "incidentes"("nodo_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "usuarios"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "usuarios"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolo_secciones" ADD CONSTRAINT "protocolo_secciones_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos"("proyecto_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obras" ADD CONSTRAINT "obras_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos"("proyecto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obras" ADD CONSTRAINT "obras_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "usuarios"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obras" ADD CONSTRAINT "obras_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "usuarios"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodos" ADD CONSTRAINT "nodos_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("obra_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodos" ADD CONSTRAINT "nodos_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos"("proyecto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodos" ADD CONSTRAINT "nodos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "usuarios"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodos" ADD CONSTRAINT "nodos_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "usuarios"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodo_metricas" ADD CONSTRAINT "nodo_metricas_nodo_id_fkey" FOREIGN KEY ("nodo_id") REFERENCES "nodos"("nodo_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklists_diarios" ADD CONSTRAINT "checklists_diarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes_semanales" ADD CONSTRAINT "reportes_semanales_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos"("proyecto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes_semanales" ADD CONSTRAINT "reportes_semanales_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuarios"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes_semanales" ADD CONSTRAINT "reportes_semanales_validado_por_fkey" FOREIGN KEY ("validado_por") REFERENCES "usuarios"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_nodo_id_fkey" FOREIGN KEY ("nodo_id") REFERENCES "nodos"("nodo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("obra_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "usuarios"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;
