import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
} from "@mui/material";
import { ArrowBack, CheckCircle, Save } from "@mui/icons-material";
import { MainLayout } from "../layouts/MainLayout";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { APPROVED_COURSES_KEY, COURSE_CATALOG } from "../config/constants";
import type { ApprovedCoursesData, CatalogCourse } from "../types/student";

/**
 * Página para seleccionar materias aprobadas
 */

export function ApprovedCoursesPage() {
  const navigate = useNavigate();
  const [approvedCoursesData, setApprovedCoursesData] =
    useLocalStorage<ApprovedCoursesData>(APPROVED_COURSES_KEY, {
      approvedCodes: [],
    });

  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(
    new Set(approvedCoursesData.approvedCodes || [])
  );

  const toggleCourse = (code: string) => {
    setSelectedCodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  const saveCourses = () => {
    const approvedCodes = Array.from(selectedCodes);
    setApprovedCoursesData({ approvedCodes });
    navigate("/");
  };

  const handleBack = () => {
    navigate("/");
  };

  // Agrupar materias por año y cuatrimestre
  const groupedCourses = COURSE_CATALOG.reduce(
    (acc, course) => {
      const yearKey = course.year;
      if (!acc[yearKey]) {
        acc[yearKey] = {
          year: course.year,
          "Primer Cuatrimestre": [],
          "Segundo Cuatrimestre": [],
        };
      }
      acc[yearKey][course.semester].push(course);
      return acc;
    },
    {} as Record<
      number,
      {
        year: number;
        "Primer Cuatrimestre": CatalogCourse[];
        "Segundo Cuatrimestre": CatalogCourse[];
      }
    >
  );

  // Convertir a array y ordenar por año
  const sortedYears = Object.values(groupedCourses).sort(
    (a, b) => a.year - b.year
  );

  return (
    <MainLayout>
      <Box>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 3 }}>
          Volver
        </Button>

        <Typography variant="h4" component="h1" gutterBottom align="center">
          Materias aprobadas
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          align="center"
        >
          Seleccioná las materias que ya aprobaste para considerar las
          correlativas
        </Typography>

        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Chip
            label={`${selectedCodes.size} materias seleccionadas`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Lista de materias por año y cuatrimestre */}
        <Stack spacing={4}>
          {sortedYears.map((yearData) => (
            <Box key={yearData.year}>
              <Typography
                variant="h5"
                gutterBottom
                color="primary"
                sx={{ mb: 2 }}
              >
                Año {yearData.year}
              </Typography>
              <Grid container spacing={2}>
                {/* Primer Cuatrimestre */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="text.secondary"
                      >
                        Primer Cuatrimestre
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {yearData["Primer Cuatrimestre"].length > 0 ? (
                        <List disablePadding>
                          {yearData["Primer Cuatrimestre"].map((course) => {
                            const isApproved = selectedCodes.has(course.code);
                            return (
                              <ListItem
                                key={course.code}
                                disablePadding
                                sx={{
                                  borderBottom: "1px solid",
                                  borderColor: "divider",
                                  "&:last-child": { borderBottom: "none" },
                                }}
                              >
                                <ListItemButton
                                  onClick={() => toggleCourse(course.code)}
                                  sx={{
                                    bgcolor: isApproved
                                      ? "success.light"
                                      : "transparent",
                                    "&:hover": {
                                      bgcolor: isApproved
                                        ? "success.main"
                                        : "action.hover",
                                    },
                                    transition: "background-color 0.2s",
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        justifyContent="space-between"
                                      >
                                        <Typography
                                          variant="body2"
                                          fontWeight="medium"
                                        >
                                          {course.code} - {course.name}
                                        </Typography>
                                        {isApproved && (
                                          <CheckCircle
                                            color="success"
                                            fontSize="small"
                                          />
                                        )}
                                      </Stack>
                                    }
                                  />
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </List>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ py: 2 }}
                        >
                          No hay materias en este cuatrimestre
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Segundo Cuatrimestre */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="text.secondary"
                      >
                        Segundo Cuatrimestre
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {yearData["Segundo Cuatrimestre"].length > 0 ? (
                        <List disablePadding>
                          {yearData["Segundo Cuatrimestre"].map((course) => {
                            const isApproved = selectedCodes.has(course.code);
                            return (
                              <ListItem
                                key={course.code}
                                disablePadding
                                sx={{
                                  borderBottom: "1px solid",
                                  borderColor: "divider",
                                  "&:last-child": { borderBottom: "none" },
                                }}
                              >
                                <ListItemButton
                                  onClick={() => toggleCourse(course.code)}
                                  sx={{
                                    bgcolor: isApproved
                                      ? "success.light"
                                      : "transparent",
                                    "&:hover": {
                                      bgcolor: isApproved
                                        ? "success.main"
                                        : "action.hover",
                                    },
                                    transition: "background-color 0.2s",
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        justifyContent="space-between"
                                      >
                                        <Typography
                                          variant="body2"
                                          fontWeight="medium"
                                        >
                                          {course.code} - {course.name}
                                        </Typography>
                                        {isApproved && (
                                          <CheckCircle
                                            color="success"
                                            fontSize="small"
                                          />
                                        )}
                                      </Stack>
                                    }
                                  />
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </List>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ py: 2 }}
                        >
                          No hay materias en este cuatrimestre
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Botón de guardar */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Save />}
            onClick={saveCourses}
          >
            Guardar cambios
          </Button>
        </Box>
      </Box>
    </MainLayout>
  );
}
