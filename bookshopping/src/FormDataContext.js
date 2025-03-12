import React, { createContext, useState, useContext } from 'react';

// Create Context
const FormDataContext = createContext();

// Create a custom hook to use the context
export const useFormData = () => useContext(FormDataContext);

// Create the Context Provider component
export const FormDataProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        gmail: '',
        phone: '',
        password: '',
        rePassword:'',
        
    });

    // Function to update the form data
    const updateFormData = (newData) => {
        setFormData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };

    return (
        <FormDataContext.Provider value={{ formData, updateFormData }}>
            {children}
        </FormDataContext.Provider>
    );
};
