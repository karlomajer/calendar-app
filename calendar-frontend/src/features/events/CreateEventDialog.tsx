import { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { format } from "date-fns";
import useCreateEventMutation from "./mutations/useCreateEventMutation";
import RHFTextField from "../../components/hook-form/RHFTextField";

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
}

interface CreateEventFormValues {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
}

const createEventSchema = Yup.object().shape({
  name: Yup.string().required("Event name is required"),
  date: Yup.string().required("Date is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test("is-after", "End time must be after start time", function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;

      return value > startTime;
    }),
});

const CreateEventDialog = ({ open, onClose }: CreateEventDialogProps) => {
  const { mutate: createEvent, isPending: isCreatingEvent } =
    useCreateEventMutation();

  const defaultValues = useMemo(
    () => ({
      name: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "10:00",
    }),
    []
  );

  const methods = useForm<CreateEventFormValues>({
    resolver: yupResolver(createEventSchema),
    defaultValues: defaultValues,
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: CreateEventFormValues) => {
    createEvent(data, {
      onSuccess: () => handleClose(),
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              {methods.formState.errors.root && (
                <Alert severity="error">
                  {methods.formState.errors.root.message}
                </Alert>
              )}
              <RHFTextField name="name" label="Event Name" required />
              <RHFTextField
                name="date"
                label="Date"
                type="date"
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <RHFTextField
                name="startTime"
                label="Start Time"
                type="time"
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <RHFTextField
                name="endTime"
                label="End Time"
                type="time"
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              disabled={isSubmitting || isCreatingEvent}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={isSubmitting || isCreatingEvent}
              disabled={isSubmitting || isCreatingEvent}
            >
              Create Event
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default CreateEventDialog;
