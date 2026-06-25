-- CreateTable
CREATE TABLE "checklist_plantillas" (
    "plantilla_id" SERIAL NOT NULL,
    "plantilla_codigo" VARCHAR(80) NOT NULL,
    "plantilla_titulo" VARCHAR(255) NOT NULL,
    "plantilla_descripcion" TEXT,
    "plantilla_frecuencia" VARCHAR(30) NOT NULL,
    "plantilla_cargo" VARCHAR(200) NOT NULL,
    "plantilla_activa" BOOLEAN NOT NULL DEFAULT true,
    "proyecto_id" INTEGER NOT NULL,
    "responsable_id" INTEGER NOT NULL,
    "supervisor_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_by" INTEGER,
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checklist_plantillas_pkey" PRIMARY KEY ("plantilla_id")
);

-- CreateTable
CREATE TABLE "checklist_plantilla_items" (
    "item_id" SERIAL NOT NULL,
    "item_orden" INTEGER NOT NULL,
    "item_titulo" VARCHAR(500) NOT NULL,
    "item_descripcion" TEXT,
    "item_tipo" VARCHAR(30) NOT NULL DEFAULT 'check',
    "item_obligatorio" BOOLEAN NOT NULL DEFAULT true,
    "item_recurrente" BOOLEAN NOT NULL DEFAULT true,
    "item_activo" BOOLEAN NOT NULL DEFAULT true,
    "item_creado_por" INTEGER,
    "item_fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plantilla_id" INTEGER NOT NULL,

    CONSTRAINT "checklist_plantilla_items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "checklist_ejecuciones" (
    "ejecucion_id" SERIAL NOT NULL,
    "ejecucion_fecha_programada" DATE NOT NULL,
    "ejecucion_estado" VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    "ejecucion_observaciones" TEXT,
    "ejecucion_fecha_inicio" TIMESTAMP(3),
    "ejecucion_fecha_completada" TIMESTAMP(3),
    "ejecucion_fecha_revisada" TIMESTAMP(3),
    "ejecucion_comentario_revisor" TEXT,
    "plantilla_id" INTEGER NOT NULL,
    "ejecutado_por" INTEGER,
    "revisado_por" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checklist_ejecuciones_pkey" PRIMARY KEY ("ejecucion_id")
);

-- CreateTable
CREATE TABLE "checklist_respuestas" (
    "respuesta_id" SERIAL NOT NULL,
    "respuesta_valor" TEXT,
    "respuesta_comentario" TEXT,
    "ejecucion_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checklist_respuestas_pkey" PRIMARY KEY ("respuesta_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "checklist_plantillas_plantilla_codigo_key" ON "checklist_plantillas"("plantilla_codigo");

-- CreateIndex
CREATE INDEX "checklist_plantilla_items_plantilla_id_item_orden_idx" ON "checklist_plantilla_items"("plantilla_id", "item_orden");

-- CreateIndex
CREATE INDEX "checklist_plantilla_items_plantilla_id_item_activo_idx" ON "checklist_plantilla_items"("plantilla_id", "item_activo");

-- CreateIndex
CREATE INDEX "checklist_ejecuciones_ejecucion_estado_idx" ON "checklist_ejecuciones"("ejecucion_estado");

-- CreateIndex
CREATE INDEX "checklist_ejecuciones_ejecucion_fecha_programada_idx" ON "checklist_ejecuciones"("ejecucion_fecha_programada");

-- CreateIndex
CREATE UNIQUE INDEX "checklist_respuestas_ejecucion_id_item_id_key" ON "checklist_respuestas"("ejecucion_id", "item_id");

-- AddForeignKey
ALTER TABLE "checklist_plantillas" ADD CONSTRAINT "checklist_plantillas_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos"("proyecto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_plantillas" ADD CONSTRAINT "checklist_plantillas_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "usuarios"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_plantillas" ADD CONSTRAINT "checklist_plantillas_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "usuarios"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_plantilla_items" ADD CONSTRAINT "checklist_plantilla_items_plantilla_id_fkey" FOREIGN KEY ("plantilla_id") REFERENCES "checklist_plantillas"("plantilla_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_plantilla_items" ADD CONSTRAINT "checklist_plantilla_items_item_creado_por_fkey" FOREIGN KEY ("item_creado_por") REFERENCES "usuarios"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_ejecuciones" ADD CONSTRAINT "checklist_ejecuciones_plantilla_id_fkey" FOREIGN KEY ("plantilla_id") REFERENCES "checklist_plantillas"("plantilla_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_ejecuciones" ADD CONSTRAINT "checklist_ejecuciones_ejecutado_por_fkey" FOREIGN KEY ("ejecutado_por") REFERENCES "usuarios"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_ejecuciones" ADD CONSTRAINT "checklist_ejecuciones_revisado_por_fkey" FOREIGN KEY ("revisado_por") REFERENCES "usuarios"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_respuestas" ADD CONSTRAINT "checklist_respuestas_ejecucion_id_fkey" FOREIGN KEY ("ejecucion_id") REFERENCES "checklist_ejecuciones"("ejecucion_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_respuestas" ADD CONSTRAINT "checklist_respuestas_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "checklist_plantilla_items"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;
