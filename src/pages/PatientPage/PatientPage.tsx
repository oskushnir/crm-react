import { getPatient } from "@/api/patients";
import { DeletePatientButton } from "@/components/DeletePatientButton";
import { DialogForAddClient } from "@/components/Dialog";
import { Spinner } from "@/components/Spinner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/types/Patients";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export const PatientPage = () => {
  const { patientId } = useParams();

  const navigate = useNavigate();

  const { isPending, error, data: patientData } = useQuery<Patient, Error>({
    queryKey: ['patients', patientId],
    queryFn: () => getPatient(Number(patientId)),
  });

  const hasMedicalHistory = (medicalHistory: string[] | null | undefined) => {
    if (!Array.isArray(medicalHistory) || medicalHistory.length === 0) return "Empty";
    return medicalHistory.join(", ") || "Empty";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full py-4">
        <h1 className="text-2xl font-bold justify-center flex mb-4">Patient Details</h1>
        {isPending ? (
          <div className="flex justify-center items-center h-[500px]">
            <Spinner size={25} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[500px] gap-4">
            <Alert className="flex border-none justify-center items-center" variant="destructive">
              <AlertCircleIcon />
              <AlertTitle className="font-bold text-2xl">Unable to load patient details.</AlertTitle>
            </Alert>

            <Button className="text-white" onClick={() => navigate('/patients')}>Go Back</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-7">
            <div>
              <p><strong>Name:</strong> {`${patientData.firstName} ${patientData.lastName}`}</p>
              <p><strong>Birthday:</strong> {patientData.birthday ? new Date(patientData.birthday).toLocaleDateString("en-GB") : "No birthday"}</p>
              <p><strong>Phone:</strong> {patientData.phoneNumber}</p>
              <p><strong>Email:</strong> {patientData.email}</p>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-xl font-bold justify-center flex">Medical History</h1>

              <div>
                <p><strong>Allergies:</strong> {hasMedicalHistory(patientData.medicalHistory?.allergic)}</p>
                <p><strong>Chronic diseases:</strong> {hasMedicalHistory(patientData.medicalHistory?.chronicDiseases)}</p>
                <p><strong>Medications to be taken:</strong> {hasMedicalHistory(patientData.medicalHistory?.takingMedication)}</p>
                <p><strong>Skin diseases:</strong> {hasMedicalHistory(patientData.medicalHistory?.skinDiseases)}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-8">
              <div className="flex gap-8">
                {patientData && (
                  <DialogForAddClient
                    isEditMode={true}
                    patientIdToEdit={Number(patientId)}
                    patientDataToEdit={patientData}
                  />
                )}

                <DeletePatientButton patientId={Number(patientId)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}