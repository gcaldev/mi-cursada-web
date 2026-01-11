import { z } from 'zod';

/**
 * Schema de validación para el formulario de estudiante
 * Define todas las reglas de validación usando Zod
 */

const skillLevelSchema = z.enum(['Principiante', 'Intermedio', 'Avanzado'], {
  errorMap: () => ({ message: 'Selecciona un nivel válido' }),
});

const workAvailabilitySchema = z.enum(['No trabaja', 'Trabajo part-time', 'Trabajo full-time'], {
  errorMap: () => ({ message: 'Selecciona una opción válida' }),
});

export const studentFormSchema = z.object({
  padron: z
    .number({
      required_error: 'El padrón es obligatorio',
      invalid_type_error: 'El padrón debe ser un número',
    })
    .positive('El padrón debe ser un número positivo')
    .int('El padrón debe ser un número entero'),

  skillLevels: z.record(z.string(), skillLevelSchema).refine(
    (data) => {
      const requiredAreas = ['Gestión', 'Programación', 'Matemática'];
      return requiredAreas.every((area) => area in data && data[area]);
    },
    {
      message: 'Debes seleccionar un nivel para todas las áreas',
    }
  ),

  maxCourses: z
    .number({
      required_error: 'La cantidad máxima de materias es obligatoria',
      invalid_type_error: 'Debe ser un número',
    })
    .positive('Debe ser mayor a 0')
    .int('Debe ser un número entero')
    .max(10, 'El máximo recomendado es 10 materias'),

  workAvailability: workAvailabilitySchema,
});

export type StudentFormSchema = z.infer<typeof studentFormSchema>;
