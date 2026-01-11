import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Autocomplete,
  ToggleButton,
} from "@mui/material";
import {
  ArrowBack,
  CheckCircle,
  Warning,
  School,
  FilterAltOff,
} from "@mui/icons-material";
import { MainLayout } from "../layouts/MainLayout";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { APPROVED_COURSES_KEY, STORAGE_KEY } from "../config/constants";
import { CourseCombinationCard } from "../components/CourseCombinationCard";
import type { StudentFormData } from "../types/student";
import { calculateCourseCombinations } from "../utils/courseCombinations";
import { mockCourseApi } from "../utils/courseApiMock";

type SortOption = "compatibility" | "mostHours" | "mostCredits" | "leastHours";

/**
 * Página de resultados: Muestra combinaciones de materias
 */
export function ResultsPage() {
  const navigate = useNavigate();
  const [formData] = useLocalStorage<Partial<StudentFormData>>(STORAGE_KEY, {});
  const [{ approvedCodes }] = useLocalStorage<{ approvedCodes: string[] }>(
    APPROVED_COURSES_KEY,
    { approvedCodes: [] }
  );

  const [sortBy, setSortBy] = useState<SortOption>("compatibility");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [showOnlyNoConflicts, setShowOnlyNoConflicts] = useState(false);

  const combinations = useMemo(
    () => calculateCourseCombinations(formData, approvedCodes, mockCourseApi),
    [formData, approvedCodes]
  );

  // Filtrar combinaciones por materias seleccionadas y sin conflictos
  const filteredCombinations = useMemo(() => {
    let filtered = combinations;

    // Filtrar por materias seleccionadas
    if (selectedCourses.length > 0) {
      filtered = filtered.filter((combo) =>
        selectedCourses.every((courseId) =>
          combo.courses.some((course) => course.id === courseId)
        )
      );
    }

    // Filtrar por sin conflictos
    if (showOnlyNoConflicts) {
      filtered = filtered.filter((combo) => !combo.warnings?.length);
    }

    return filtered;
  }, [combinations, selectedCourses, showOnlyNoConflicts]);

  // Obtener todas las materias disponibles para autocompletado
  const availableCourses = useMemo(() => {
    const coursesSet = new Map<string, { id: string; name: string }>();
    combinations.forEach((combo) => {
      combo.courses.forEach((course) => {
        if (!coursesSet.has(course.id)) {
          coursesSet.set(course.id, { id: course.id, name: course.name });
        }
      });
    });
    return Array.from(coursesSet.values());
  }, [combinations]);

  // Ordenar combinaciones
  const sortedCombinations = useMemo(() => {
    const sorted = [...filteredCombinations];

    switch (sortBy) {
      case "compatibility":
        // Ya vienen ordenadas por compatibilidad
        return sorted;
      case "mostHours":
        return sorted.sort((a, b) => b.totalHours - a.totalHours);
      case "mostCredits":
        return sorted.sort((a, b) => b.totalCredits - a.totalCredits);
      case "leastHours":
        return sorted.sort((a, b) => a.totalHours - b.totalHours);
      default:
        return sorted;
    }
  }, [filteredCombinations, sortBy]);

  // Estadísticas
  const stats = useMemo(() => {
    const withoutConflicts = combinations.filter(
      (c) => !c.warnings?.length
    ).length;
    const withConflicts = combinations.filter((c) => c.warnings?.length).length;
    const allCourses = new Set(
      combinations.flatMap((c) => c.courses.map((course) => course.id))
    );

    return {
      total: combinations.length,
      withoutConflicts,
      withConflicts,
      availableCourses: allCourses.size,
    };
  }, [combinations]);

  // Normalizar score a porcentaje
  const normalizeScore = (score: number): number => {
    // Asumiendo que el score máximo es 200 (según el código)
    return Math.round((score / 200) * 100);
  };

  // Si no hay datos, redirigir al formulario
  if (!formData.padron) {
    navigate("/");
    return null;
  }

  const handleBack = () => {
    navigate("/");
  };

  return (
    <MainLayout maxWidth="xl">
      <Box>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 3 }}>
          Volver al formulario
        </Button>

        <Typography variant="h4" component="h1" gutterBottom align="center">
          Combinaciones de Materias
        </Typography>

        {/* Tarjeta de Estadísticas */}
        <Card
          sx={{ mb: 4, bgcolor: "grey.50", border: 1, borderColor: "grey.200" }}
        >
          <CardContent sx={{ p: { xs: 1.5, md: 3 } }}>
            <Grid container spacing={{ xs: 1, md: 3 }}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Box
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    borderRadius: 2,
                    bgcolor: "white",
                    border: 1,
                    borderColor: "grey.200",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="primary.main"
                      sx={{ fontSize: { xs: "1.25rem", md: "2.125rem" } }}
                    >
                      {stats.total}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.7rem", md: "0.875rem" } }}
                    >
                      Combinaciones
                    </Typography>
                  </Box>
                  <School
                    sx={{
                      fontSize: { xs: 28, md: 40 },
                      color: "primary.light",
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Box
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    borderRadius: 2,
                    bgcolor: "white",
                    border: 1,
                    borderColor: "grey.200",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="success.main"
                      sx={{ fontSize: { xs: "1.25rem", md: "2.125rem" } }}
                    >
                      {stats.withoutConflicts}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.7rem", md: "0.875rem" } }}
                    >
                      Sin Conflictos
                    </Typography>
                  </Box>
                  <CheckCircle
                    sx={{
                      fontSize: { xs: 28, md: 40 },
                      color: "success.light",
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Box
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    borderRadius: 2,
                    bgcolor: "white",
                    border: 1,
                    borderColor: "grey.200",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="warning.main"
                      sx={{ fontSize: { xs: "1.25rem", md: "2.125rem" } }}
                    >
                      {stats.withConflicts}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.7rem", md: "0.875rem" } }}
                    >
                      Con Conflictos
                    </Typography>
                  </Box>
                  <Warning
                    sx={{
                      fontSize: { xs: 28, md: 40 },
                      color: "warning.light",
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Box
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    borderRadius: 2,
                    bgcolor: "white",
                    border: 1,
                    borderColor: "grey.200",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="info.main"
                      sx={{ fontSize: { xs: "1.25rem", md: "2.125rem" } }}
                    >
                      {stats.availableCourses}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.7rem", md: "0.875rem" } }}
                    >
                      Materias Cursables
                    </Typography>
                  </Box>
                  <School
                    sx={{ fontSize: { xs: 28, md: 40 }, color: "info.light" }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Filtros y Ordenamiento */}
        <Stack spacing={2} sx={{ mb: 4 }}>
          {/* Fila 1: Autocomplete de materias */}
          <Autocomplete
            multiple
            options={availableCourses}
            getOptionLabel={(option) => `${option.id} - ${option.name}`}
            value={availableCourses.filter((c) =>
              selectedCourses.includes(c.id)
            )}
            onChange={(_, newValue) => {
              setSelectedCourses(newValue.map((v) => v.id));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Buscar materias para filtrar..."
                label="Filtrar por materias"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  label={option.name}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "& .MuiChip-deleteIcon": {
                      color: "primary.light",
                      "&:hover": {
                        color: "white",
                      },
                    },
                  }}
                />
              ))
            }
          />

          {/* Fila 2: Botón sin conflictos y ordenamiento */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <ToggleButton
              value="noConflicts"
              selected={showOnlyNoConflicts}
              onChange={() => setShowOnlyNoConflicts(!showOnlyNoConflicts)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 1,
                px: 3,
                "&.Mui-selected": {
                  bgcolor: "success.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "success.dark",
                  },
                },
              }}
            >
              <FilterAltOff sx={{ mr: 1 }} />
              Solo Sin Conflictos
            </ToggleButton>

            <FormControl sx={{ minWidth: 250, flex: 1 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                label="Ordenar por"
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <MenuItem value="compatibility">
                  Score de Compatibilidad
                </MenuItem>
                <MenuItem value="mostHours">Mayor Cantidad de Horas</MenuItem>
                <MenuItem value="mostCredits">
                  Mayor Cantidad de Créditos
                </MenuItem>
                <MenuItem value="leastHours">Menor Cantidad de Horas</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {/* Resultados */}
        {sortedCombinations.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" align="center">
                No se encontraron combinaciones que coincidan con tu búsqueda.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Mostrando {sortedCombinations.length} de {combinations.length}{" "}
              combinaciones
            </Typography>

            {/* Grid de Combinaciones */}
            <Grid container spacing={3}>
              {sortedCombinations.map((combination) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={combination.id}>
                  <CourseCombinationCard
                    combination={combination}
                    normalizeScore={normalizeScore}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </MainLayout>
  );
}
