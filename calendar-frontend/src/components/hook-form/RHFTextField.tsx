import { useFormContext, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

interface Props {
  name: string;
}

type RHFTextFieldProps = Props & TextFieldProps;

const RHFTextField = ({ name, ...other }: RHFTextFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
};

export default RHFTextField;
