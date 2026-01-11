import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
  Divider,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Star,
  Warning,
  Schedule,
  BookmarkBorder,
  Check,
  LocalLibrary,
} from "@mui/icons-material";
import type { CourseCombination, CourseApi } from "../types/student";

interface CourseCombinationCardProps {
  combination: CourseCombination;
  normalizeScore: (score: number) => number;
}

const categoryColors: Record<
  string,
  "primary" | "secondary" | "success" | "warning" | "info" | "error"
> = {
  Programación: "primary",
  Gestión: "secondary",
  Matemática: "info",
  Arquitectura: "warning",
  Sistemas: "success",
  Electiva: "error",
};

export function CourseCombinationCard({
  combination,
  normalizeScore,
}: CourseCombinationCardProps) {
  const isTopChoice = combination.priority === 1;
  const hasConflicts = combination.warnings && combination.warnings.length > 0;
  const scorePercentage = normalizeScore(combination.compatibilityScore);

  // Obtener materias con conflictos y sus superposiciones
  const coursesWithConflicts = combination.courses.filter(
    (course) => combination.coursesMetadata?.[course.id]?.hasTimeConflict
  );

  return (
    <Card
      elevation={isTopChoice ? 4 : 1}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: 2,
        borderColor: isTopChoice ? "success.main" : "divider",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 2 }}
        >
          {/* Score y Badge */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Porcentaje simple sin círculo */}
            <Box>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                {scorePercentage}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                compatibilidad
              </Typography>
            </Box>

            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Combinación #{combination.priority}
              </Typography>
              {isTopChoice && (
                <Chip
                  icon={<Star />}
                  label="Mejor Opción"
                  size="small"
                  sx={{
                    bgcolor: "success.main",
                    color: "success.contrastText",
                    fontWeight: 600,
                    "& .MuiChip-icon": {
                      color: "success.light",
                    },
                  }}
                />
              )}
              {hasConflicts && (
                <Chip
                  icon={<Warning />}
                  label="Conflicto"
                  size="small"
                  sx={{
                    bgcolor: "warning.main",
                    color: "warning.contrastText",
                    fontWeight: 600,
                    "& .MuiChip-icon": {
                      color: "warning.light",
                    },
                  }}
                />
              )}
            </Stack>
          </Stack>

          {/* Botón Guardar */}
          <Tooltip title="Guardar combinación">
            <IconButton size="small" color="primary">
              <BookmarkBorder />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Créditos y Horas */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip
            icon={<LocalLibrary />}
            label={`${combination.totalCredits} créditos`}
            size="small"
            sx={{
              bgcolor: "success.main",
              color: "success.contrastText",
              fontWeight: 500,
            }}
          />
          <Chip
            icon={<Schedule />}
            label={`${Math.round(combination.totalHours)}hs semanales`}
            size="small"
            sx={{
              bgcolor: "info.main",
              color: "info.contrastText",
              fontWeight: 500,
            }}
          />
        </Stack>

        {/* Conflictos de horario */}
        {hasConflicts && coursesWithConflicts.length > 0 && (
          <Box
            sx={{
              p: 1.5,
              mb: 2,
              bgcolor: "warning.lighter",
              borderRadius: 1,
              border: 1,
              borderColor: "warning.light",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Warning fontSize="small" color="warning" />
              <Typography
                variant="body2"
                fontWeight="medium"
                color="warning.dark"
              >
                Horas superpuestas:{" "}
                {Math.round(combination.overlapHours * 10) / 10}h
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {coursesWithConflicts.map((c) => c.name).join(", ")}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Lista de Materias */}
        <Stack sx={{ flexGrow: 1 }}>
          {combination.courses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              metadata={combination.coursesMetadata?.[course.id]}
              allCourses={combination.courses}
            />
          ))}
        </Stack>

        {/* Botón Seleccionar */}
        <Button
          variant={isTopChoice ? "contained" : "outlined"}
          color="primary"
          fullWidth
          startIcon={<Check />}
          sx={{ mt: 3 }}
        >
          Seleccionar Combinación
        </Button>
      </CardContent>
    </Card>
  );
}

interface CourseItemProps {
  course: CourseApi;
  metadata?: {
    isRecommended?: boolean;
    hasTimeConflict?: boolean;
    warnings?: string[];
    overlapsWithCourses?: string[];
  };
  allCourses: CourseApi[];
}

function CourseItem({ course, metadata, allCourses }: CourseItemProps) {
  const hasTimeConflict = metadata?.hasTimeConflict || false;
  const overlapsWithCourses = metadata?.overlapsWithCourses || [];

  // Obtener nombres de las materias con las que se superpone
  const overlappingCourseNames = overlapsWithCourses
    .map((id) => allCourses.find((c) => c.id === id)?.name)
    .filter(Boolean);

  return (
    <Box sx={{ py: 1.5 }}>
      <Stack spacing={0.5}>
        {/* Encabezado de la materia */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight="medium">
              {course.name}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {course.id}
            </Typography>
            <Chip
              label={course.category}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.7rem",
                bgcolor:
                  categoryColors[course.category] === "primary"
                    ? "primary.main"
                    : categoryColors[course.category] === "secondary"
                      ? "secondary.main"
                      : categoryColors[course.category] === "success"
                        ? "success.main"
                        : categoryColors[course.category] === "warning"
                          ? "warning.main"
                          : categoryColors[course.category] === "error"
                            ? "error.main"
                            : "grey.300",
                color:
                  categoryColors[course.category] === "primary"
                    ? "primary.contrastText"
                    : categoryColors[course.category] === "secondary"
                      ? "secondary.contrastText"
                      : categoryColors[course.category] === "success"
                        ? "success.contrastText"
                        : categoryColors[course.category] === "warning"
                          ? "warning.contrastText"
                          : categoryColors[course.category] === "error"
                            ? "error.contrastText"
                            : "text.primary",
                fontWeight: 500,
              }}
            />
          </Stack>
        </Stack>

        {/* Horarios */}
        <Stack spacing={0.25}>
          {course.schedules.map((schedule, idx) => (
            <Typography key={idx} variant="caption" color="text.secondary">
              {schedule.day}: {schedule.startTime} - {schedule.endTime}
            </Typography>
          ))}
        </Stack>

        {/* Superposiciones */}
        {hasTimeConflict && overlappingCourseNames.length > 0 && (
          <Typography
            variant="caption"
            color="warning.dark"
            fontWeight="medium"
            sx={{ mt: 0.5 }}
          >
            ⚠️ Superpone con: {overlappingCourseNames.join(", ")}
          </Typography>
        )}
      </Stack>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
