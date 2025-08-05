import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Formik, Form } from "formik";
import { z } from "zod";
import { DialogFooter } from "@/components/ui/dialog";
import Combobox from "./Combobox";
import { Spinner } from "./Spinner";

const clientFormMedicalSchema = z.object({
  allergic: z.string().trim(),
  chronicDiseases: z.string().trim(),
  takingMedication: z.string().trim(),
  skinDiseases: z.string().trim(),
});

type ClientFormMedicalValues = z.infer<typeof clientFormMedicalSchema>;

function FormMedicalClient({
  isEditMode,
  initialValues,
  onBack,
  onSubmit,
  loading,
  error,
}: {
  isEditMode?: boolean,
  initialValues: ClientFormMedicalValues,
  onBack: () => void,
  onSubmit: (values: ClientFormMedicalValues) => void,
  loading?: boolean,
  error?: boolean,
}) {

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(values)}
      validate={(values) => {
        const result = clientFormMedicalSchema.safeParse(values);
        if (result.success) return {};
        return result.error.flatten().fieldErrors;
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="grid gap-4">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="allergic">Allergy</Label>

                <Combobox value={values.allergic} onChange={setFieldValue} placeHolder='allergy' name='allergic' />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="takingMedication">Medication Intake</Label>

                <Combobox value={values.takingMedication} onChange={setFieldValue} placeHolder='medication intake' name="takingMedication" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="chronicDiseases">Chronic Diseases</Label>

                <Combobox value={values.chronicDiseases} onChange={setFieldValue} placeHolder='chronic diseases' name="chronicDiseases" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="skinDiseases">Skin Diseases</Label>

                <Combobox value={values.skinDiseases} onChange={setFieldValue} placeHolder='skin diseases' name="skinDiseases" />
              </div>
            </div>

            <DialogFooter>
              <Button variant={"outline"} type="button" onClick={onBack}>{isEditMode ? 'Close' : 'Back'}</Button>

              <Button className="text-white" disabled={loading} type="submit">
                {loading && !error ? <Spinner size={15} /> : isEditMode ? 'Save' : "Add Medical History"}
              </Button>
            </DialogFooter>
          </div>
          </Form>
      )}
        </Formik>
        
  );
}

export default FormMedicalClient;
