export type Patient = {
  birthday: string;
  createdAt: string;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  medicalHistory: {
    id: number;
    patientId: number;
    allergic: string[];
    chronicDiseases: string[];
    takingMedication: string[];
    skinDiseases: string[];
  };
  phoneNumber: string;
  updatedAt: string;
};
