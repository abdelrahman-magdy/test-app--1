import { useState, useEffect } from 'react';

function useForm({ initialValues, onSubmit }) {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleBlur = (event) => {
    const { target } = event;
    const { name } = target;

    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(values);
    } catch (error) {
      setErrors(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const validate = async () => {
      try {
        await onSubmit(values);
        setErrors({});
      } catch (error) {
        setErrors(error);
      }
    };

    validate();
  }, [onSubmit, values]);

  const resetForm = () => {
    setValues(initialValues || {});
    setErrors({});
    setTouched({});
    setSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    submitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}

export default useForm;
