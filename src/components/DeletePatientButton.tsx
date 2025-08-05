import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { deletePatient } from "@/api/patients";
import { deletePatientMedicalHistory } from "@/api/medicalHistory";
import { Spinner } from "./Spinner";
import { usePushMessage } from "../hooks/use-push-message";

export const DeletePatientButton = ({ patientId }: { patientId: number }) => {
  const navigate = useNavigate();
  const pushMessage = usePushMessage();

  const mutationDeleteMedicalHistory = useMutation({
    mutationFn: deletePatientMedicalHistory,
  });

  const mutationDeletePatient = useMutation({
    mutationFn: deletePatient,
  });

  const handleDelete = async () => {
    try {
      await mutationDeleteMedicalHistory.mutateAsync(patientId);
      await mutationDeletePatient.mutateAsync(patientId);

      pushMessage({
        success: true,
        title: "Patient deleted successfully",
        description: "The patient and their medical history have been removed.",
      });

      navigate("/patients");
    } catch (error) {
      const err = error as Error;

      pushMessage({
        success: false,
        title: "Error deleting patient",
        description: err.message || "An error occurred while deleting the patient.",
      });
    }
  };

  const isLoading =
    mutationDeletePatient.isPending || mutationDeleteMedicalHistory.isPending;

  return (
    <Button
      variant="destructive"
      disabled={isLoading}
      onClick={handleDelete}
    >
      {isLoading ? (
        <Spinner size={15} />
      ) : (
        "Delete Patient"
      )}
    </Button>
  );
};
