import type { PatientFormMedicalValues } from "@/types/PatientFormMedicalHistory";
import type { PatientFormValues } from "@/types/PatientFormValues";

export const PATIENT_INITIAL_VALUES: PatientFormValues = {
  firstName: "",
  lastName: "",
  birthday: null,
  phoneNumber: "",
  email: "",
};

export const PATIENT_MEDICAL_INITIAL_VALUES: PatientFormMedicalValues = {
  allergic: "",
  chronicDiseases: "",
  takingMedication: "",
  skinDiseases: "",
};