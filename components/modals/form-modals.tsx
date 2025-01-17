"use client";

import { useEffect, useState } from "react";
import Modal from "../modal";
import { Button } from "../ui/button";
import { Field, Form, Formik, FormikProps, ErrorMessage } from "formik";

interface FieldConfig {
  name: string;
  label: string;
  type: string;
}
interface FormModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (values: T) => void;
  loading: boolean;
  fields: FieldConfig[];
  initialValues: T;
  validationSchema: any;
  pathName: string;
}

export const FormModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  onConfirm,
  loading,
  fields,
  initialValues,
  validationSchema,
  pathName,
}: FormModalProps<T>) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // return null if the modal running on server component
  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={`Create new ${pathName}`}
      description={`Modal Box to create new ${pathName}`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onConfirm(values);
          }}
        >
          {(props) => {
            const { values, errors, touched, handleChange } = props;

            return (
              <Form>
                {fields.map((field, idx) => (
                  <div key={idx} className="">
                    <label htmlFor={field.name} className="formik-label">
                      {field.label}
                    </label>
                    <div>
                      <Field
                        className="formik-input"
                        type={field.type}
                        name={field.name}
                        onChange={handleChange}
                        value={values[field.name]}
                      />
                      {touched[field.name] && errors[field.name] ? (
                        <div className="text-red-600 mb-4">
                          <ErrorMessage name={field.name} />
                        </div>
                      ) : (
                        <div className="mb-4" />
                      )}
                    </div>
                  </div>
                ))}

                <button
                  className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                  type="submit"
                  disabled={loading}
                >
                  Submit
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};
