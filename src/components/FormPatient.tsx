import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Formik, Form, ErrorMessage } from "formik";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { CalendarOfBirth } from "./Calendar";
import type { PatientFormValues } from "@/types/PatientFormValues";
import { Spinner } from "./Spinner";
import { clientFormSchema } from "@/utils/schemas";

function FormClient({
  isEditMode,
  initialValues,
  onNext,
  loading,
  newPatientError,
}: {
  isEditMode?: boolean,
  initialValues: PatientFormValues,
  onNext: (values: PatientFormValues) => void,
  loading: boolean,
  newPatientError: boolean,
}) {
  const toDateOrUndefined = (value: unknown): Date | undefined => {
    if (value instanceof Date) {
      return value;
    }

    if (value) {
      return new Date(value as string);
    }

    return undefined;
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validateOnMount
      onSubmit={(values) => onNext(values)}
      validate={(values) => {
        const parsedValues = {
          ...values,
          birthday:
            toDateOrUndefined(values.birthday),
        };

        const result = clientFormSchema.safeParse(parsedValues);

        if (result.success) return {};
        return result.error.flatten().fieldErrors;
      }}
    >
      {({ values, handleChange, setFieldValue, dirty, isValid, isSubmitting }) => (
        <Form>
          <div className="grid gap-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">First name</Label>

                <Input id="name-1" name="firstName" placeholder="Enter first name" value={values.firstName} onChange={handleChange} />

                <ErrorMessage name="firstName" component="span" className="errorFormMessage" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="name-2">Last name</Label>

                <Input id="name-2" name="lastName" placeholder="Enter last name" value={values.lastName} onChange={handleChange} />

                <ErrorMessage name="lastName" component="span" className="errorFormMessage" />
              </div>

              <div className="grid gap-3">
                <Label>Birthday</Label>

                <CalendarOfBirth
                  birthday={
                    toDateOrUndefined(values.birthday)
                  }
                  setBirthday={(date) => setFieldValue("birthday", date)}
                  label="Select date"
                />

                <ErrorMessage name="birthday" component="span" className="errorFormMessage" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phoneNumber">Phone number</Label>

                <Input id="phoneNumber" name="phoneNumber" placeholder="Enter phone number" value={values.phoneNumber} onChange={handleChange} />

                <ErrorMessage name="phoneNumber" component="span" className="errorFormMessage" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>

                <Input id="email" name="email" placeholder="Enter email" value={values.email} onChange={handleChange} />

                <ErrorMessage name="email" component="span" className="errorFormMessage" />
              </div>
            </div>

            <DialogFooter className="flex">
              <DialogClose asChild>
                <Button variant={"outline"}>{isEditMode ? 'Close' : 'Cancel'}</Button>
              </DialogClose>

              <Button className="text-white" disabled={loading || isSubmitting || !dirty || !isValid} type="submit">
                {loading && !newPatientError ? <Spinner size={15} /> : isEditMode ? 'Save' : 'Next'}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default FormClient;
