import { useState } from "react";
import { DialogForAddClient } from "./Dialog";
import type { PatientFormValues } from "@/types/PatientFormValues";
import type { PatientFormMedicalValues } from "@/types/PatientFormMedicalHistory";
import { PATIENT_INITIAL_VALUES, PATIENT_MEDICAL_INITIAL_VALUES } from "@/utils/patientInitialValues";
import FormClient from "./FormPatient";
import FormMedicalClient from "./FormPatientMedical";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNewPatient, updatePatient } from "@/api/patients";
import { addPatientMedicalHistory } from "@/api/medicalHistory";
import { usePushMessage } from "../hooks/use-push-message";
import { getChangedFields } from "@/utils/getChangedFields";
import { transformMedicalData } from "@/utils/transformMedicalData";
import addPatientIcon from '@/../public/icons/add-patient.svg';

export const CreatePatientDialog = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<number>(1);

  const [tempPatientData, setTempPatientData] = useState<PatientFormValues>(PATIENT_INITIAL_VALUES);
  const [medicalFormData, setMedicalFormData] = useState<PatientFormMedicalValues>(PATIENT_MEDICAL_INITIAL_VALUES);

  const [patientId, setPatientId] = useState<number | null>(null);

  const pushMessage = usePushMessage();
  const queryClient = useQueryClient();

  const mutationAddPatient = useMutation({
    mutationFn: addNewPatient,
  });

  const mutationAddMedicalHistory = useMutation({
    mutationFn: addPatientMedicalHistory,
  });

  const mutationUpdatePatient = useMutation({
    mutationFn: (data: { patientId: number } & PatientFormValues) => updatePatient(data),
  });

  const handleNext = async (data: PatientFormValues) => {
    try {
      if (!patientId) {
        const createdPatient = await mutationAddPatient.mutateAsync(data);

        setTempPatientData(data);
        setPatientId(createdPatient.id);
        setStep(2);

        await queryClient.invalidateQueries({ queryKey: ["patients"] });

        pushMessage({
          success: true,
          title: "Patient added successfully",
          description: "The patient has been added to the system.",
        });

        return;
      }

      const changedData = getChangedFields(tempPatientData, data);

      if (Object.keys(changedData).length > 0) {
        await mutationUpdatePatient.mutateAsync({
          patientId,
          ...(changedData as PatientFormValues),
        });

        setTempPatientData(data);

        await queryClient.invalidateQueries({ queryKey: ["patients"] });

        pushMessage({
          success: true,
          title: "Patient added successfully",
          description: "The patient has been added to the system.",
        });
      }

      setStep(2);
    } catch (err) {
      pushMessage({
        success: false,
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "An error occurred while processing your request.",
      });
    }
  };

  const handleSubmit = async (data: PatientFormMedicalValues) => {
    try {
      if (patientId) {
        await mutationAddMedicalHistory.mutateAsync({
          patientId,
          ...transformMedicalData(data),
        });

        await queryClient.invalidateQueries({ queryKey: ["patients"] });

        pushMessage({
          success: true,
          title: "Medical history added successfully",
          description: "The medical history has been added to the system.",
        });

        handleReset();
        return;
      }
    } catch {
      pushMessage({
        success: false,
        title: "Something went wrong",
        description: "Can't add medical history. Please try again later.",
      });
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleReset = () => {
    mutationAddPatient.reset();
    mutationAddMedicalHistory.reset();
    mutationUpdatePatient.reset()
    setTempPatientData(PATIENT_INITIAL_VALUES);
    setMedicalFormData(PATIENT_MEDICAL_INITIAL_VALUES);
    setPatientId(null);
    setOpen(false);
    setStep(1);
  }

  return (
    <DialogForAddClient
      open={open}
      setOpen={setOpen}
      buttonIcon={<img src={addPatientIcon} alt="Add patient" />}
      title="Add new patient"
      buttonLabel="Add patient"
      description="Fill in the patient details to add a new patient."
      isEditMode={false}
      handleReset={handleReset}
      children={
        <div>
          {step === 1 &&
            <FormClient
              initialValues={tempPatientData}
              onNext={(data) => handleNext(data)}
              newPatientError={mutationAddPatient.isError}
              loading={mutationAddPatient.isPending}
            />
          }

          {step === 2 &&
            <FormMedicalClient
              initialValues={medicalFormData}
              onBack={handleBack}
              onSubmit={(data) => handleSubmit(data)}
              error={mutationAddMedicalHistory.isError}
              loading={mutationAddMedicalHistory.isPending}
            />
          }
        </div>
      }
    />
  );
}