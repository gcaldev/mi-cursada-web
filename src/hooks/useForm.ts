import { useState, useCallback, useEffect } from "react";
import { ZodSchema } from "zod";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Hook para manejar formularios con validación Zod y persistencia en localStorage
 */

interface UseFormOptions<T> {
  schema: ZodSchema<T>;
  storageKey: string;
  initialValues: T;
}

export function useForm<T extends Record<string, any>>({
  schema,
  storageKey,
  initialValues,
}: UseFormOptions<T>) {
  const [storedData, setStoredData] = useLocalStorage<Partial<T>>(
    storageKey,
    {}
  );
  const [formData, setFormData] = useState<T>({
    ...initialValues,
    ...storedData,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // Validar el formulario completo
  const validate = useCallback((): boolean => {
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof T, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof T;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [formData, schema]);

  // Actualizar un campo específico
  const setFieldValue = useCallback(
    (field: keyof T, value: unknown) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };
        setStoredData(updated);
        return updated;
      });

      // Validar el campo individual si ya fue tocado
      setTouched((prev) => ({ ...prev, [field]: true }));
    },
    [setStoredData]
  );

  // Marcar un campo como tocado
  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Validar cuando cambian los datos o cuando un campo es tocado
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      validate();
    }
  }, [formData, touched, validate]);

  // Resetear el formulario
  const reset = useCallback(() => {
    setFormData(initialValues);
    setStoredData({});
    setErrors({});
    setTouched({});
  }, [initialValues, setStoredData]);

  const isValid =
    Object.keys(errors).length === 0 && Object.keys(touched).length > 0;

  return {
    formData,
    errors,
    touched,
    isValid,
    setFieldValue,
    setFieldTouched,
    validate,
    reset,
  };
}
