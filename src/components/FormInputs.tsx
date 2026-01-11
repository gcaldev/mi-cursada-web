import {
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Box,
  Typography,
} from "@mui/material";
import type { SkillLevel, WorkAvailability } from "../types/student";
import { SKILL_LEVELS, WORK_AVAILABILITY_OPTIONS } from "../config/constants";
/**
 * Componente para seleccionar el nivel de habilidad de un área
 */

interface SkillLevelSelectorProps {
  area: string;
  value: SkillLevel | "";
  onChange: (value: SkillLevel) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
}

export function SkillLevelSelector({
  area,
  value,
  onChange,
  onBlur,
  error,
  touched,
}: SkillLevelSelectorProps) {
  return (
    <TextField
      select
      label={area}
      value={value}
      onChange={(e) => onChange(e.target.value as SkillLevel)}
      onBlur={onBlur}
      error={touched && !!error}
      helperText={touched && error}
      sx={{ minWidth: 200 }}
    >
      <MenuItem value="" disabled>
        Selecciona un nivel
      </MenuItem>
      {SKILL_LEVELS.map((level) => (
        <MenuItem key={level} value={level}>
          {level}
        </MenuItem>
      ))}
    </TextField>
  );
}

/**
 * Componente para seleccionar la disponibilidad laboral
 */

interface WorkAvailabilitySelectorProps {
  value: WorkAvailability | "";
  onChange: (value: WorkAvailability) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
}

export function WorkAvailabilitySelector({
  value,
  onChange,
  onBlur,
  error,
  touched,
}: WorkAvailabilitySelectorProps) {
  return (
    <FormControl error={touched && !!error} onBlur={onBlur}>
      <FormLabel component="legend">Disponibilidad laboral</FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value as WorkAvailability)}
      >
        {WORK_AVAILABILITY_OPTIONS.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
      {touched && error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

/**
 * Componente para mostrar todas las áreas de habilidad
 */

interface SkillAreasGridProps {
  areas: string[];
  values: Record<string, SkillLevel | "">;
  onChange: (area: string, value: SkillLevel) => void;
  onBlur: (area: string) => void;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
}

export function SkillAreasGrid({
  areas,
  values,
  onChange,
  onBlur,
  errors = {},
  touched = {},
}: SkillAreasGridProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Nivel de habilidades por área
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
          mt: 2,
        }}
      >
        {areas.map((area) => (
          <SkillLevelSelector
            key={area}
            area={area}
            value={values[area] || ""}
            onChange={(value) => onChange(area, value)}
            onBlur={() => onBlur(area)}
            error={errors[area]}
            touched={touched[area]}
          />
        ))}
      </Box>
    </Box>
  );
}
