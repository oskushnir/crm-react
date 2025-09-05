import type { PatientFormMedicalValues } from "@/types/PatientFormMedicalHistory";

const split = (s?: string) =>
  (s ?? "")
    .split(",")
    .map(x => x.trim())
    .filter(Boolean);

export function transformMedicalData(data: Partial<PatientFormMedicalValues>) {
  return {
    allergic: split(data.allergic),
    chronicDiseases: split(data.chronicDiseases),
    takingMedication: split(data.takingMedication),
    skinDiseases: split(data.skinDiseases),
  };
}
