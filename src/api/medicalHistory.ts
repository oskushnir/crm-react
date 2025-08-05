import type { PatientFormMedicalValuesAPI } from "@/types/PatientMedicalHistoryAPI";
import { axiosInstance } from "./api";
import type { AxiosError } from "axios";

export async function getPatientMedicalHistory(patientId: number | null) {
  const res = await axiosInstance.get(`/medical-history/${patientId}`);

  return res.data;
}

export async function addPatientMedicalHistory(
  data: PatientFormMedicalValuesAPI
) {
  try {
    const res = await axiosInstance.post(`/medical-history`, data);

    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    throw new Error(
      axiosError?.response?.data?.message || "Failed to add medical history"
    );
  }
}

export async function updatePatientMedicalHistory({
  patientId,
  ...data
}: PatientFormMedicalValuesAPI & { patientId: number }) {
  try {
    const res = await axiosInstance.patch(`/medical-history/${patientId}`, data);

    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    throw new Error(axiosError?.response?.data?.message || "Failed to update medical history");
  }
}

export async function deletePatientMedicalHistory(patientId: number) {
  try {
    const res = await axiosInstance.delete(`/medical-history/${patientId}`);

    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    throw new Error(axiosError?.response?.data?.message || "Failed to delete medical history");
  }
}
