import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { MainLayout } from "../layouts/MainLayout";
import {
  SkillAreasGrid,
  WorkAvailabilitySelector,
} from "../components/FormInputs";
import { useForm } from "../hooks/useForm";
import { studentFormSchema } from "../types/schemas";
import { STORAGE_KEY, SKILL_AREAS } from "../config/constants";
import type {
  StudentFormData,
  SkillLevel,
  WorkAvailability,
} from "../types/student";

/**
 * Página principal: Formulario de entrada de datos del estudiante
 */

const initialFormData: StudentFormData = {
  padron: 0,
  skillLevels: {},
  maxCourses: 0,
  workAvailability: "" as WorkAvailability,
};

export function StudentFormPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const {
    formData,
    errors,
    touched,
    isValid,
    setFieldValue,
    setFieldTouched,
    validate,
  } = useForm<StudentFormData>({
    schema: studentFormSchema,
    storageKey: STORAGE_KEY,
    initialValues: initialFormData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitAttempted(true);

    // Marcar todos los campos como tocados
    setFieldTouched("padron");
    setFieldTouched("skillLevels");
    setFieldTouched("maxCourses");
    setFieldTouched("workAvailability");

    if (validate()) {
      // Navegar a la página de resultados
      navigate("/resultados");
    } else {
      setSubmitError("El formulario contiene errores. Revisá los campos.");
    }
  };

  const handleSkillLevelChange = (area: string, value: SkillLevel) => {
    setFieldValue("skillLevels", {
      ...formData.skillLevels,
      [area]: value,
    });
  };

  const handleSkillLevelBlur = () => {
    setFieldTouched("skillLevels");
  };

  return (
    <MainLayout>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Planificá tu cursada
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          align="center"
        >
          Completá tus datos para generar combinaciones óptimas de materias
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Stack spacing={4}>
          {/* Número de padrón */}
          <TextField
            label="Número de padrón"
            type="number"
            placeholder="Ej: 107143"
            value={formData.padron || ""}
            onChange={(e) => setFieldValue("padron", Number(e.target.value))}
            onBlur={() => setFieldTouched("padron")}
            error={touched.padron && !!errors.padron}
            helperText={touched.padron && errors.padron}
            required
          />

          {/* Niveles de habilidad */}
          <Box>
            <SkillAreasGrid
              areas={SKILL_AREAS}
              values={formData.skillLevels}
              onChange={handleSkillLevelChange}
              onBlur={handleSkillLevelBlur}
              errors={
                submitAttempted && touched.skillLevels
                  ? { general: errors.skillLevels as string }
                  : {}
              }
              touched={
                submitAttempted && touched.skillLevels ? { general: true } : {}
              }
            />
            {submitAttempted && touched.skillLevels && errors.skillLevels && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.skillLevels}
              </Alert>
            )}
          </Box>

          {/* Cantidad máxima de materias */}
          <TextField
            label="Cantidad máxima de materias"
            type="number"
            placeholder="Ej: 5"
            value={formData.maxCourses || ""}
            onChange={(e) =>
              setFieldValue("maxCourses", Number(e.target.value))
            }
            onBlur={() => setFieldTouched("maxCourses")}
            error={touched.maxCourses && !!errors.maxCourses}
            helperText={
              touched.maxCourses && errors.maxCourses
                ? errors.maxCourses
                : "Indicá cuántas materias querés cursar como máximo"
            }
            required
          />

          {/* Disponibilidad laboral */}
          <WorkAvailabilitySelector
            value={formData.workAvailability}
            onChange={(value) => setFieldValue("workAvailability", value)}
            onBlur={() => setFieldTouched("workAvailability")}
            error={errors.workAvailability}
            touched={touched.workAvailability}
          />

          <Divider />

          {/* Acciones */}
          <Stack spacing={2}>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" alignItems="center">
                <Button
                  variant="text"
                  size="small"
                  color="secondary"
                  onClick={() => navigate("/materias-aprobadas")}
                >
                  Materias aprobadas
                </Button>
                <Tooltip title="Marcá las materias que ya aprobaste para considerar las correlativas en la recomendación">
                  <IconButton size="small" color="primary">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isValid && Object.keys(touched).length > 0}
              >
                Calcular recomendaciones
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </MainLayout>
  );
}
