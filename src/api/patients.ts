import type { PatientFormValues } from "@/types/PatientFormValues";
import { axiosInstance } from "./api";
import type { AxiosError } from "axios";

export async function getAllPatients(
  page: number,
  limit: number,
  search: string,
  birthdayFrom?: string,
  birthdayTo?: string,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC"
) {
  const res = await axiosInstance.get("/patients", {
    params: {
      page,
      limit,
      search: search || undefined,
      birthdayFrom: birthdayFrom || undefined,
      birthdayTo: birthdayTo || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
    },
  });

  return res.data;
}

export async function getPatient(patientId: number) {
  const res = await axiosInstance.get(`/patients/${patientId}`);

  return res.data;
}

export async function addNewPatient(data: PatientFormValues) {
  try {
    const res = await axiosInstance.post("/patients", data);

    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    throw new Error(
      axiosError?.response?.data?.message || "Failed to add patient"
    );
  }
}

export async function updatePatient({
  patientId,
  ...data
}: { patientId: number } & PatientFormValues) {
  try {
    const res = await axiosInstance.patch(`/patients/${patientId}`, data);

    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    throw new Error(
      axiosError?.response?.data?.message || "Failed to update patient"
    );
  }
}

export async function deletePatient(id: number) {
  try {
    const res = await axiosInstance.delete(`/patients/${id}`);

    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    throw new Error(
      axiosError?.response?.data?.message || "Failed to delete patient"
    );
  }
}
