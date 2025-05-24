import { useState, useCallback } from "react";
import { FormState, UseFormOptions } from "../interface/hooks";

export const useForm = <T>({ initialValues, validate }: UseFormOptions<T>) => {
    const [formState, setFormState] = useState<FormState<T>>({
        values: initialValues,
        errors: {},
        submitError: null,
        success: "",
    });

    const handleChange = useCallback(
        <K extends keyof T>(key: K, value: T[K]) => {
            setFormState((prev) => ({
                ...prev,
                values: { ...prev.values, [key]: value },
                errors: { ...prev.errors, [key]: undefined },
                submitError: null,
            }));
        },
        []
    );

    const handleSubmit = useCallback(
        (onSubmit: (values: T) => Promise<void>) => async (e: React.FormEvent) => {
            e.preventDefault();
            const validationErrors = validate ? validate(formState.values) : {};
            if (Object.keys(validationErrors).length > 0) {
                setFormState((prev) => ({ ...prev, errors: validationErrors, submitError: null }));
                return;
            }

            try {
                await onSubmit(formState.values);
                setFormState((prev) => ({ ...prev, success: "Успешно сохранено", errors: {}, submitError: null }));
            } catch (err: any) {
                setFormState((prev) => ({ ...prev, submitError: err.message, errors: {} }));
            }
        },
        [validate, formState.values]
    );

    const resetForm = useCallback(() => {
        setFormState({ values: initialValues, errors: {}, submitError: null, success: "" });
    }, [initialValues]);

    return {
        values: formState.values,
        errors: formState.errors,
        submitError: formState.submitError,
        success: formState.success,
        handleChange,
        handleSubmit,
        resetForm,
    };
};