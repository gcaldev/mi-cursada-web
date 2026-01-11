import type {
  SkillArea,
  SkillLevel,
  WorkAvailability,
  CatalogCourse,
} from "../types/student";

/**
 * Constantes de la aplicación
 */

export const STORAGE_KEY = "student-form-v1";
export const APPROVED_COURSES_KEY = "approved-courses-v1";

export const SKILL_AREAS: SkillArea[] = [
  "Gestión",
  "Programación",
  "Matemática",
];

export const SKILL_LEVELS: SkillLevel[] = [
  "Principiante",
  "Intermedio",
  "Avanzado",
];

export const WORK_AVAILABILITY_OPTIONS: WorkAvailability[] = [
  "No trabaja",
  "Trabajo part-time",
  "Trabajo full-time",
];

/**
 * Catálogo completo de materias de la carrera
 * Organizado por año y cuatrimestre
 */
export const COURSE_CATALOG: CatalogCourse[] = [
  // Primer Año - Primer Cuatrimestre
  {
    code: "61.03",
    name: "Análisis Matemático I",
    year: 1,
    semester: "Primer Cuatrimestre",
  },
  { code: "62.01", name: "Física I", year: 1, semester: "Primer Cuatrimestre" },
  {
    code: "75.01",
    name: "Álgebra y Geometría Analítica",
    year: 1,
    semester: "Primer Cuatrimestre",
  },
  {
    code: "75.40",
    name: "Algoritmos y Programación I",
    year: 1,
    semester: "Primer Cuatrimestre",
  },
  { code: "95.01", name: "Química", year: 1, semester: "Primer Cuatrimestre" },

  // Primer Año - Segundo Cuatrimestre
  {
    code: "61.08",
    name: "Análisis Matemático II",
    year: 1,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "62.03",
    name: "Física II",
    year: 1,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "75.02",
    name: "Análisis Numérico I",
    year: 1,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "75.41",
    name: "Algoritmos y Programación II",
    year: 1,
    semester: "Segundo Cuatrimestre",
  },

  // Segundo Año - Primer Cuatrimestre
  {
    code: "61.09",
    name: "Probabilidad y Estadística",
    year: 2,
    semester: "Primer Cuatrimestre",
  },
  {
    code: "66.20",
    name: "Arquitectura de Computadoras",
    year: 2,
    semester: "Primer Cuatrimestre",
  },
  {
    code: "75.03",
    name: "Análisis Numérico II",
    year: 2,
    semester: "Primer Cuatrimestre",
  },
  {
    code: "75.07",
    name: "Algoritmos y Programación III",
    year: 2,
    semester: "Primer Cuatrimestre",
  },

  // Segundo Año - Segundo Cuatrimestre
  {
    code: "71.14",
    name: "Modelos y Optimización I",
    year: 2,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "75.04",
    name: "Elementos de Teoría de Algoritmos",
    year: 2,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "75.08",
    name: "Sistemas Operativos",
    year: 2,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "75.42",
    name: "Taller de Programación I",
    year: 2,
    semester: "Segundo Cuatrimestre",
  },

  // Tercer Año - Primer Cuatrimestre
  {
    code: "71.15",
    name: "Modelos y Optimización II",
    year: 3,
    semester: "Primer Cuatrimestre",
  },
  {
    code: "75.09",
    name: "Análisis de la Información",
    year: 3,
    semester: "Primer Cuatrimestre",
  },
  {
    code: "75.12",
    name: "Organización de Datos",
    year: 3,
    semester: "Primer Cuatrimestre",
  },
  {
    code: "75.43",
    name: "Introducción a Sistemas Distribuidos",
    year: 3,
    semester: "Primer Cuatrimestre",
  },

  // Tercer Año - Segundo Cuatrimestre
  {
    code: "75.06",
    name: "Organización del Computador",
    year: 3,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "75.10",
    name: "Técnicas de Diseño de Algoritmos",
    year: 3,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "75.44",
    name: "Administración y Control de Proyectos I",
    year: 3,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "75.59",
    name: "Técnicas de Programación Concurrente",
    year: 3,
    semester: "Segundo Cuatrimestre",
  },

  // Cuarto Año - Primer Cuatrimestre
  {
    code: "75.15",
    name: "Base de Datos",
    year: 4,
    semester: "Primer Cuatrimestre",
  },
  {
    code: "75.28",
    name: "Lenguajes y Compiladores",
    year: 4,
    semester: "Primer Cuatrimestre",
  },
  {
    code: "75.29",
    name: "Teoría de las Comunicaciones",
    year: 4,
    semester: "Primer Cuatrimestre",
  },
  {
    code: "75.73",
    name: "Criptografía y Seguridad Informática",
    year: 4,
    semester: "Primer Cuatrimestre",
  },

  // Cuarto Año - Segundo Cuatrimestre
  {
    code: "75.08",
    name: "Sistemas Operativos II",
    year: 4,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "75.31",
    name: "Ingeniería de Software",
    year: 4,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "75.47",
    name: "Taller de Desarrollo de Proyectos II",
    year: 4,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "75.52",
    name: "Redes de Computadoras",
    year: 4,
    semester: "Segundo Cuatrimestre",
  },

  // Quinto Año - Primer Cuatrimestre
  {
    code: "75.39",
    name: "Sistemas Gráficos",
    year: 5,
    semester: "Primer Cuatrimestre",
  },
  {
    code: "75.74",
    name: "Administración de Recursos",
    year: 5,
    semester: "Primer Cuatrimestre",
  },
  {
    code: "75.99",
    name: "Trabajo Profesional",
    year: 5,
    semester: "Primer Cuatrimestre",
  },

  // Quinto Año - Segundo Cuatrimestre
  {
    code: "75.35",
    name: "Teoría de Lenguajes",
    year: 5,
    semester: "Segundo Cuatrimestre",
  },
  {
    code: "75.99",
    name: "Trabajo Profesional",
    year: 5,
    semester: "Segundo Cuatrimestre",
  },
];
