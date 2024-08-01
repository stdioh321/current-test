import { z } from "zod";
import "./App.css";
import DynamicForm from "./components/dynami-form";
import { useState } from "react";
import styled from "styled-components";


const formData = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    value: '',
    placeholder: 'Enter your email',
    config: {
      ColSize: 24,
    },
    validations: [{ required: true, message: 'Email is required' }],
  },
  {
    name: 'username',
    type: 'string',
    label: 'Username',
    value: '',
    placeholder: 'Enter your username',
    config: {
      mask: '*****',
      dependsOn: 'email',
      ColSize: 24,
    },
    validations: [{ required: true, message: 'Username is required' }],
  },
  {
    name: 'age',
    type: 'number',
    label: 'Age',
    value: '',
    placeholder: 'Enter your age',
    config: {
      allowNegative: false,
      ColSize: 24,
    },
    validations: [{ required: true, message: 'Age is required' }],
  },
  {
    name: 'dob',
    type: 'date',
    label: 'Date of Birth',
    value: '',
    placeholder: 'Select your date of birth',
    config: {
      format: 'DD/MM/YYYY',
      time: false,
      ColSize: 24,
    },
    validations: [{ required: true, message: 'Date of Birth is required' }],
  },
  {
    name: 'salary',
    type: 'currency',
    label: 'Salary',
    value: '',
    placeholder: 'Enter your salary',
    config: {
      prefix: 'R$',
      separator: '.',
      ColSize: 24,
    },
    validations: [{ required: true, message: 'Salary is required' }],
  },
  {
    name: 'gender',
    type: 'select',
    label: 'Gender',
    value: null,
    placeholder: 'Select your gender',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
    ],
    config: {
      allowEmpty: true,
      ColSize: 24,
    },
    validations: [{ required: true, message: 'Gender is required' }],
  },
  {
    name: 'hobbies',
    type: 'multiselect',
    label: 'Hobbies',
    value: null,
    placeholder: 'Select your hobbies',
    options: [
      { value: 'reading', label: 'Reading' },
      { value: 'travelling', label: 'Travelling' },
      { value: 'sports', label: 'Sports' },
    ],
    config: {
      allowEmpty: true,
      ColSize: 24,
    },
    validations: [{ required: true, message: 'Hobbies are required' }],
  },
];

const handleSubmit = (values) => {
  console.log('Submitted values:', values);
};

const handleClear = () => {
  console.log('Form cleared');
};

const handleCancel = () => {
  console.log('Form canceled');
};


function App() {
  const [validationErrors, setValidationErrors] = useState([]);

  const handleSubmit = (values) => {
    console.log("Submitted values:", values);
  };

  const handleClear = () => {
    console.log("Form cleared");
  };

  const handleCancel = () => {
    console.log("Form canceled");
  };

  const handleFormValidation = (errors) => {
    setValidationErrors(errors);
  };

  const Container = styled.div`
    padding: 8px;
  `;
  return (
    <Container>
      <DynamicForm
        data={formData}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onCancel={handleCancel}
        config={{
          showCancelButton: true,
          showClearButton: true,
        }}
      />
      <div>
        <h3>Validation Errors:</h3>
        <pre>{JSON.stringify(validationErrors, null, 2)}</pre>
      </div>
    </Container>
  );
}

export default App;
