import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Formik, Form, ErrorMessage } from "formik";
import { z } from "zod";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { CalendarOfBirth } from "./Calendar";
import type { PatientFormValues } from "@/types/PatientFormValues";
import { Spinner } from "./Spinner";

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

  const clientFormSchema = z.object({
    firstName: isEditMode ? z.string().trim() : z.string().trim().min(2, "First name must be at least 2 characters long").regex(/^[a-zA-Z]+$/, "First name must contain only letters"),
    lastName: isEditMode ? z.string().trim() : z.string().trim().min(2, "Last name must be at least 2 characters long").regex(/^[a-zA-Z]+$/, "Last name must contain only letters"),
    birthday: isEditMode ? z.date().nullable() : z.date({
      required_error: "Birthday is required",
      invalid_type_error: "Invalid date format",
    }),
    phoneNumber: isEditMode ? z.string().trim() : z.string().trim().regex(/^\+?[0-9\s-]+$/, "Phone number must be a valid format"),
    email: isEditMode ? z.string().trim() : z.string().trim().email("Email must be a valid email address"),
  });

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={(values) => onNext(values)}
      validate={(values) => {
        const parsedValues = {
          ...values,
          birthday:
            values.birthday instanceof Date
              ? values.birthday
              : values.birthday
                ? new Date(values.birthday)
                : null,
        };

        const result = clientFormSchema.safeParse(parsedValues);

        if (result.success) return {};
        return result.error.flatten().fieldErrors;
      }}
    >
      {({ values, handleChange, setFieldValue }) => (
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
                    values.birthday instanceof Date
                      ? values.birthday
                      : values.birthday
                        ? new Date(values.birthday)
                        : undefined
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

              <Button className="text-white" disabled={loading} type="submit">
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
