/**
 * Tipos relacionados con los datos del estudiante
 */

export type SkillLevel = "Principiante" | "Intermedio" | "Avanzado";

export type WorkAvailability =
  | "No trabaja"
  | "Trabajo part-time"
  | "Trabajo full-time";

export type SkillArea = "Gestión" | "Programación" | "Matemática";

export interface SkillLevels {
  [area: string]: SkillLevel;
}

export interface StudentFormData {
  padron: number;
  skillLevels: SkillLevels;
  maxCourses: number;
  workAvailability: WorkAvailability;
}

/**
 * Tipos para las combinaciones de materias
 */

export type CourseCategory =
  | "Programación"
  | "Gestión"
  | "Matemática"
  | "Arquitectura"
  | "Sistemas"
  | "Electiva";

export type DayOfWeek =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado";

export interface CourseSchedule {
  day: DayOfWeek;
  startTime: string; // formato "HH:MM"
  endTime: string; // formato "HH:MM"
}

export interface Course {
  id: string;
  name: string;
  category: CourseCategory;
  schedules: CourseSchedule[];
  isRecommended?: boolean;
  hasTimeConflict?: boolean;
  warnings?: string[];
}

export interface CourseApi {
  id: string;
  name: string;
  category: CourseCategory;
  schedules: CourseSchedule[];
  requiredCourses: string[];
  year: number;
  semester: Semester;
  difficulty: "Hard" | "Easy" | "Medium";
  credits: number; // Créditos que otorga la materia
}

export interface CourseCombination {
  id: string;
  courses: CourseApi[];
  priority: number; // 1 = highest priority
  totalHours: number;
  totalCredits: number; // Créditos totales de la combinación
  overlapHours: number; // Horas totales superpuestas
  compatibilityScore: number; // 0-100
  warnings?: string[];
  coursesMetadata?: {
    [courseId: string]: {
      isRecommended?: boolean;
      hasTimeConflict?: boolean;
      warnings?: string[];
      overlapsWithCourses?: string[]; // IDs de materias con las que se superpone
    };
  };
}

/**
 * Tipos para el catálogo de materias y materias aprobadas
 */

export type Semester = "Primer Cuatrimestre" | "Segundo Cuatrimestre";

export interface CatalogCourse {
  code: string;
  name: string;
  year: number; // 1, 2, 3, 4, 5
  semester: Semester;
}

export interface ApprovedCoursesData {
  approvedCodes: string[]; // Array de códigos de materias aprobadas
}
