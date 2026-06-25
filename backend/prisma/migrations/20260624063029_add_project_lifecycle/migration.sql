-- AlterTable
ALTER TABLE "proyectos" ADD COLUMN     "proyecto_lifecycle" VARCHAR(50) NOT NULL DEFAULT 'operativo',
ADD COLUMN     "proyecto_relacionado" VARCHAR(50);
