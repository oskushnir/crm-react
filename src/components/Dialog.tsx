import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormClient from "./FormPatient";
import FormMedicalClient from "./FormPatientMedical";
import type { PatientFormValues } from "@/types/PatientFormValues";
import { addNewPatient, updatePatient } from "@/api/patients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PatientFormMedicalValues } from "@/types/PatientFormMedicalHistory";
import { addPatientMedicalHistory, updatePatientMedicalHistory } from "@/api/medicalHistory";
import type { Patient } from "@/types/Patients";
import type { PatientFormMedicalValuesAPI } from "@/types/PatientMedicalHistoryAPI";
import addPatientIcon from '@/../public/icons/add-patient.svg';
import { useTheme } from "next-themes";
import { usePushMessage } from "../hooks/use-push-message";
import { TabsForm } from "./Tabs";
import { TabsContent } from "@radix-ui/react-tabs";

const PATIENT_INITIAL_VALUES: PatientFormValues = {
  firstName: "",
  lastName: "",
  birthday: null,
  phoneNumber: "",
  email: "",
};

const PATIENT_MEDICAL_INITIAL_VALUES: PatientFormMedicalValues = {
  allergic: "",
  chronicDiseases: "",
  takingMedication: "",
  skinDiseases: "",
};

function transformMedicalData(data: Partial<PatientFormMedicalValues>) {
  return {
    allergic: (data.allergic ?? "").split(",").map((s) => s.trim()),
    chronicDiseases: (data.chronicDiseases ?? "").split(",").map((s) => s.trim()),
    takingMedication: (data.takingMedication ?? "").split(",").map((s) => s.trim()),
    skinDiseases: (data.skinDiseases ?? "").split(",").map((s) => s.trim()),
  };
}

function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

function getChangedFields<T extends Record<string, unknown>>(initial: T, current: T): Partial<T> {
  const changedFields: Partial<T> = {};

  for (const key in current) {
    if (!Object.prototype.hasOwnProperty.call(current, key)) continue;

    const initialValue = initial[key];
    const currentValue = current[key];

    const bothAreDateLike = isDate(initialValue) || isDate(currentValue);

    if (bothAreDateLike) {
      const initialDate = isDate(initialValue)
        ? initialValue.toISOString().slice(0, 10)
        : initialValue;

      const currentDate = isDate(currentValue)
        ? currentValue.toISOString().slice(0, 10)
        : currentValue;

      if (initialDate !== currentDate) {
        changedFields[key] = currentValue;
      }
    } else {
      if (initialValue !== currentValue) {
        changedFields[key] = currentValue;
      }
    }
  }

  return changedFields;
}

export function DialogForAddClient({
  isEditMode,
  patientIdToEdit,
  patientDataToEdit,
}: {
  isEditMode?: boolean;
  patientIdToEdit?: number;
  patientDataToEdit?: Patient;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<number>(1);

  const [tempPatientData, setTempPatientData] = useState<PatientFormValues>(PATIENT_INITIAL_VALUES);
  const [medicalFormData, setMedicalFormData] = useState<PatientFormMedicalValues>(PATIENT_MEDICAL_INITIAL_VALUES);

  const [patientId, setPatientId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { theme } = useTheme();
  const pushMessage = usePushMessage();

  const mutationAddPatient = useMutation({
    mutationFn: addNewPatient,
  });

  const mutationAddMedicalHistory = useMutation({
    mutationFn: addPatientMedicalHistory,
  });

  const mutationUpdatePatient = useMutation({
    mutationFn: (data: { patientId: number } & PatientFormValues) => updatePatient(data),
  });

  const updateMedicalHistory = useMutation({
    mutationFn: (data: { patientId: number } & PatientFormMedicalValuesAPI) => updatePatientMedicalHistory(data),
  });

  const handleNext = async (data: PatientFormValues) => {
    try {
      if (isEditMode && patientIdToEdit) {
        const prevPatientValues: PatientFormValues = {
          firstName: patientDataToEdit?.firstName || "",
          lastName: patientDataToEdit?.lastName || "",
          birthday: patientDataToEdit?.birthday ? new Date(patientDataToEdit.birthday) : null,
          phoneNumber: patientDataToEdit?.phoneNumber || "",
          email: patientDataToEdit?.email || "",
        };

        const changedData = getChangedFields(prevPatientValues, data);

        if (Object.keys(changedData).length > 0) {
          await mutationUpdatePatient.mutateAsync({
            patientId: patientIdToEdit,
            ...(changedData as PatientFormValues),
          });

          await queryClient.invalidateQueries({ queryKey: ["patients"] });

          pushMessage({
            success: true,
            title: "Patient updated successfully",
            description: "The patient has been updated to the system.",
          });
        } else {
          pushMessage({
            success: true,
            title: "Patient has the same data",
            description: "The patient has the same data, so it has not been updated.",
          });
        }

        handleReset();
        return;
      }

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
      if (isEditMode && patientIdToEdit) {
        const prevMedicalValues: PatientFormMedicalValues = {
          allergic: (patientDataToEdit?.medicalHistory?.allergic ?? []).join(", "),
          chronicDiseases: (patientDataToEdit?.medicalHistory?.chronicDiseases ?? []).join(", "),
          takingMedication: (patientDataToEdit?.medicalHistory?.takingMedication ?? []).join(", "),
          skinDiseases: (patientDataToEdit?.medicalHistory?.skinDiseases ?? []).join(", "),
        };

        const changedData = getChangedFields(prevMedicalValues, data);

        if (Object.keys(changedData).length > 0) {
          const mergedData = {
            allergic: data.allergic,
            chronicDiseases: data.chronicDiseases,
            takingMedication: data.takingMedication,
            skinDiseases: data.skinDiseases,
          };

          await updateMedicalHistory.mutateAsync({
            patientId: patientIdToEdit,
            ...transformMedicalData(mergedData),
          });

          await queryClient.invalidateQueries({ queryKey: ["patients"] });

          pushMessage({
            success: true,
            title: "Medical history updated successfully",
            description: "The medical history has been updated to the system.",
          });
        } else {
          pushMessage({
            success: true,
            title: "Medical history is the same",
            description: "The medical history is the same, so it has not been updated.",
          });
        }

        handleReset();
        return;
      }

      if (patientId && !isEditMode) {
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
    if (isEditMode) {
      setOpen(false);
    }

    setStep(1);
  };

  const handleReset = () => {
    mutationAddPatient.reset();
    mutationAddMedicalHistory.reset();
    setTempPatientData(PATIENT_INITIAL_VALUES);
    setMedicalFormData(PATIENT_MEDICAL_INITIAL_VALUES);
    setStep(1);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleReset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="text-white" onClick={() => setOpen(true)}>
          {!isEditMode && <img src={addPatientIcon} alt="Add Patient" />}
          {isEditMode ? 'Edit Patient' : 'New Patient'}
        </Button>
      </DialogTrigger>

      <DialogContent className={theme === 'dark' ? 'bg-[var(--sidebar)] text-[var(--sidebar-foreground)]' : ''}>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit patient' : 'Add new patient'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update patient details' : 'Fill in the patient details to add a new patient.'}
          </DialogDescription>
        </DialogHeader>

        {isEditMode ?
          <TabsForm
            defaultValue="patient"
            tabs={[
              { label: "Patient", value: "patient" },
              { label: "Medical History", value: "medicalHistory" },
            ]}
          >
            <TabsContent value='patient'>
              <FormClient
                isEditMode={isEditMode}
                initialValues={isEditMode ? {
                  firstName: patientDataToEdit?.firstName || "",
                  lastName: patientDataToEdit?.lastName || "",
                  birthday: patientDataToEdit?.birthday ? new Date(patientDataToEdit.birthday) : null,
                  phoneNumber: patientDataToEdit?.phoneNumber || "",
                  email: patientDataToEdit?.email || "",
                } : tempPatientData}
                onNext={(data) => handleNext(data)}
                newPatientError={mutationAddPatient.isError || mutationUpdatePatient.isError}
                loading={mutationAddPatient.isPending || mutationUpdatePatient.isPending}
              />
            </TabsContent>

            <TabsContent value='medicalHistory'>
              <FormMedicalClient
                isEditMode={isEditMode}
                initialValues={isEditMode ? {
                  allergic: patientDataToEdit?.medicalHistory?.allergic.join(", ") || "",
                  chronicDiseases: patientDataToEdit?.medicalHistory?.chronicDiseases.join(", ") || "",
                  takingMedication: patientDataToEdit?.medicalHistory?.takingMedication.join(", ") || "",
                  skinDiseases: patientDataToEdit?.medicalHistory?.skinDiseases.join(", ") || "",
                } : medicalFormData}
                onBack={handleBack}
                onSubmit={(data) => handleSubmit(data)}
                error={mutationAddMedicalHistory.isError || updateMedicalHistory.isError}
                loading={mutationAddMedicalHistory.isPending || mutationAddMedicalHistory.isPending}
              />
            </TabsContent>
          </TabsForm>

          :

          <div>
            {step === 1 &&
              <FormClient
                initialValues={tempPatientData}
                onNext={(data) => handleNext(data)}
                newPatientError={mutationAddPatient.isError || mutationUpdatePatient.isError}
                loading={mutationAddPatient.isPending || mutationUpdatePatient.isPending}
              />
            }

            {step === 2 &&
              <FormMedicalClient
                initialValues={medicalFormData}
                onBack={handleBack}
                onSubmit={(data) => handleSubmit(data)}
                error={mutationAddMedicalHistory.isError || updateMedicalHistory.isError}
                loading={mutationAddMedicalHistory.isPending || mutationAddMedicalHistory.isPending}
              />
            }
          </div>
        }
      </DialogContent>
    </Dialog>
  );
}
