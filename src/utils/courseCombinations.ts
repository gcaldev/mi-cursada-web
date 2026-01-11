import type {
  CourseApi,
  CourseCombination,
  StudentFormData,
  CourseSchedule,
} from "../types/student";

/* =========================
   Helpers de horario
========================= */

const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const schedulesOverlap = (a: CourseSchedule, b: CourseSchedule): boolean => {
  if (a.day !== b.day) return false;

  const startA = timeToMinutes(a.startTime);
  const endA = timeToMinutes(a.endTime);
  const startB = timeToMinutes(b.startTime);
  const endB = timeToMinutes(b.endTime);

  return startA < endB && startB < endA;
};

const hasAnyOverlap = (courses: CourseApi[]): boolean => {
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      for (const s1 of courses[i].schedules) {
        for (const s2 of courses[j].schedules) {
          if (schedulesOverlap(s1, s2)) return true;
        }
      }
    }
  }
  return false;
};

/**
 * Calcula las horas totales superpuestas entre materias
 */
const calculateOverlapHours = (courses: CourseApi[]): number => {
  let totalOverlapHours = 0;

  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      for (const s1 of courses[i].schedules) {
        for (const s2 of courses[j].schedules) {
          if (schedulesOverlap(s1, s2)) {
            // Calcular horas de superposición
            const startA = timeToMinutes(s1.startTime);
            const endA = timeToMinutes(s1.endTime);
            const startB = timeToMinutes(s2.startTime);
            const endB = timeToMinutes(s2.endTime);

            const overlapStart = Math.max(startA, startB);
            const overlapEnd = Math.min(endA, endB);
            const overlapMinutes = overlapEnd - overlapStart;

            totalOverlapHours += overlapMinutes / 60;
          }
        }
      }
    }
  }

  return totalOverlapHours;
};

const courseHasOverlap = (course: CourseApi, others: CourseApi[]): boolean => {
  for (const other of others) {
    if (course.id === other.id) continue;
    for (const s1 of course.schedules) {
      for (const s2 of other.schedules) {
        if (schedulesOverlap(s1, s2)) {
          return true;
        }
      }
    }
  }
  return false;
};

/* =========================
   Restricciones laborales
========================= */

const violatesWorkAvailability = (
  schedules: CourseSchedule[],
  workAvailability: StudentFormData["workAvailability"]
): boolean => {
  return schedules.some(({ startTime, endTime }) => {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    if (workAvailability === "Trabajo full-time") {
      return start < timeToMinutes("18:00") && end > timeToMinutes("09:00");
    }

    if (workAvailability === "Trabajo part-time") {
      return start < timeToMinutes("18:00") && end > timeToMinutes("14:00");
    }

    return false;
  });
};

/* =========================
   Score de compatibilidad
========================= */

const calculateCompatibilityScore = (
  courses: CourseApi[],
  formData: StudentFormData
): number => {
  let score = 0;
  /*
  const overlapHours = calculateOverlapHours(courses);

  // ✨ BONUS POR CANTIDAD DE MATERIAS con ajuste por superposición
  // El multiplicador base es 20, pero se reduce según las horas superpuestas
  // Por cada hora superpuesta, se reduce el multiplicador en 2 puntos
  console.log({ courses, overlapHours });
  const baseMultiplier = 20;
  const penaltyPerOverlapHour = 2;
  const adjustedMultiplier = Math.max(
    5, // Mínimo 5 puntos por materia
    baseMultiplier - overlapHours * penaltyPerOverlapHour
  );

  const courseCountBonus = courses.length * adjustedMultiplier;
  score += courseCountBonus; */

  const courseCountBonus =
    courses.filter((c) => !courseHasOverlap(c, courses)).length * 20;
  score += courseCountBonus;

  for (const course of courses) {
    // Recomendadas
    if (course.difficulty === "Easy") score += 10;

    // 🎯 BONUS POR NIVEL DE SKILL EN LA CATEGORÍA
    const skillLevel = formData.skillLevels[course.category];

    // Bonus base por nivel de habilidad (favorece categorías donde es bueno)
    if (skillLevel === "Principiante") {
      score += 5; // Bonus mínimo
      if (course.difficulty === "Easy") score += 15; // Match perfecto
    } else if (skillLevel === "Intermedio") {
      score += 12; // Bonus moderado
      if (course.difficulty === "Medium") score += 15; // Match perfecto
      if (course.difficulty === "Easy") score += 8; // También puede tomar fáciles
    } else if (skillLevel === "Avanzado") {
      score += 20; // Bonus alto - favorece materias de esta categoría
      if (course.difficulty === "Hard") score += 20; // Match perfecto
      if (course.difficulty === "Medium") score += 12; // También puede tomar medias
      if (course.difficulty === "Easy") score += 5; // También puede tomar fáciles
    }
  }

  // Bonus mismo año y cuatrimestre
  const sameYear = new Set(courses.map((c) => c.year)).size === 1;
  const sameSemester = new Set(courses.map((c) => c.semester)).size === 1;

  if (sameYear) score += 20;
  if (sameSemester) score += 10;

  // 🌟 BONUS EXTRA por concentración en categorías donde es avanzado
  // Favorece combinaciones con múltiples materias de categorías fuertes
  const categoryCounts: Record<string, number> = {};
  for (const course of courses) {
    categoryCounts[course.category] =
      (categoryCounts[course.category] || 0) + 1;
  }

  for (const [category, count] of Object.entries(categoryCounts)) {
    const skillLevel = formData.skillLevels[category];
    if (skillLevel === "Avanzado" && count >= 2) {
      // Bonus por tener múltiples materias de una categoría donde es avanzado
      score += (count - 1) * 10; // +10 por cada materia adicional de esa categoría
    } else if (skillLevel === "Intermedio" && count >= 2) {
      score += (count - 1) * 5; // +5 por cada materia adicional
    }
  }

  return Math.min(score, 200); // Aumentado el límite para acomodar nuevos bonuses
};

/* =========================
   Generador de combinaciones
========================= */

const generateCombinations = <T>(
  items: T[],
  maxSize: number,
  start = 0,
  current: T[] = [],
  result: T[][] = []
): T[][] => {
  if (current.length > 0) result.push([...current]);
  if (current.length === maxSize) return result;

  for (let i = start; i < items.length; i++) {
    current.push(items[i]);
    generateCombinations(items, maxSize, i + 1, current, result);
    current.pop();
  }

  return result;
};

/* =========================
   FUNCIÓN PRINCIPAL
========================= */

const calculateCourseCombinations = (
  formData: Partial<StudentFormData>,
  approvedCourses: string[] = [],
  allCourses: CourseApi[] = []
): CourseCombination[] => {
  if (
    !formData.workAvailability ||
    !formData.maxCourses ||
    !formData.skillLevels
  )
    return [];

  /* 1️⃣ Filtrar por correlativas */
  const eligibleCourses = allCourses.filter((course) => {
    if (approvedCourses.includes(course.id)) return false;

    return course.requiredCourses.every((req) => approvedCourses.includes(req));
  });
  console.log("Eligible Courses:", eligibleCourses);
  /* 2️⃣ Filtrar por trabajo */
  const workCompatibleCourses = eligibleCourses.filter((c) => {
    return !violatesWorkAvailability(c.schedules, formData.workAvailability!);
  });

  /* 3️⃣ Generar combinaciones */
  const rawCombinations = generateCombinations(
    workCompatibleCourses,
    formData.maxCourses
  );

  /* 4️⃣ Construir combinaciones finales */
  const combinations: CourseCombination[] = rawCombinations.map(
    (courses, index) => {
      const hasConflict = hasAnyOverlap(courses);
      const overlapHours = calculateOverlapHours(courses);

      const compatibilityScore = calculateCompatibilityScore(
        courses,
        formData as StudentFormData
      );

      // Calcular créditos totales
      const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

      // Construir metadata de cursos con información de superposiciones
      const coursesMetadata: CourseCombination["coursesMetadata"] = {};
      courses.forEach((course) => {
        const overlapsWithCourses: string[] = [];
        
        // Encontrar con qué materias se superpone
        courses.forEach((otherCourse) => {
          if (course.id !== otherCourse.id) {
            for (const s1 of course.schedules) {
              for (const s2 of otherCourse.schedules) {
                if (schedulesOverlap(s1, s2)) {
                  overlapsWithCourses.push(otherCourse.id);
                  break;
                }
              }
              if (overlapsWithCourses.includes(otherCourse.id)) break;
            }
          }
        });

        coursesMetadata[course.id] = {
          hasTimeConflict: overlapsWithCourses.length > 0,
          overlapsWithCourses: overlapsWithCourses.length > 0 ? overlapsWithCourses : undefined,
        };
      });

      return {
        id: `combination-${index}`,
        courses: courses,
        priority: 0, // se asigna luego
        totalHours: courses.reduce(
          (acc, c) =>
            acc +
            c.schedules.reduce(
              (h, s) =>
                h +
                (timeToMinutes(s.endTime) - timeToMinutes(s.startTime)) / 60,
              0
            ),
          0
        ),
        totalCredits,
        overlapHours,
        compatibilityScore,
        warnings: hasConflict ? ["Conflicto horario"] : [],
        coursesMetadata,
      };
    }
  );

  /* 5️⃣ Ordenar por calidad */
  combinations.sort((a, b) => {
    // 1️⃣ Primero por score de compatibilidad
    if (a.compatibilityScore !== b.compatibilityScore)
      return b.compatibilityScore - a.compatibilityScore;

    // 2️⃣ Luego por ausencia de conflictos
    if (a.warnings?.length !== b.warnings?.length)
      return (a.warnings?.length || 0) - (b.warnings?.length || 0);

    // 3️⃣ Finalmente, preferir MÁS materias (invertido)
    if (a.courses.length !== b.courses.length)
      return b.courses.length - a.courses.length;

    // 4️⃣ Como último criterio, menos horas totales
    return a.totalHours - b.totalHours;
  });

  /* 6️⃣ Asignar prioridad */
  combinations.forEach((c, i) => (c.priority = i + 1));

  return combinations; //combinations.slice(0, 10); // top 10
};

export { calculateCourseCombinations };
