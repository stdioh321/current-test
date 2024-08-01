import { z } from 'zod';
import './App.css';
import DynamicForm from './components/dynamic-form';


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
    validations: [z.string().email('Invalid email format')],
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
    validations: [z.string().min(1, 'Username is required')],
  },
  {
    name: 'age',
    type: 'number',
    label: 'Age',
    value: '',
    placeholder: 'Enter your age',
    config: {
      allowNegative: false,
      ColSize: 12,
    },
    validations: [z.number().min(1, 'Age must be greater than 0')],
  },
  {
    name: 'birthdate',
    type: 'date',
    label: 'Birthdate',
    value: '',
    placeholder: 'Select your birthdate',
    config: {
      format: 'DD/MM/YYYY',
      time: false,
      ColSize: 12,
    },
    validations: [z.date()],
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
      ColSize: 12,
    },
    validations: [z.number().min(0, 'Salary must be greater than 0')],
  },
  {
    name: 'country',
    type: 'select',
    label: 'Country',
    value: '',
    placeholder: 'Select your country',
    options: [
      { value: 'BR', label: 'Brazil' },
      { value: 'US', label: 'United States' },
    ],
    config: {
      allowEmpty: true,
      ColSize: 12,
    },
    validations: [z.string()],
  },
  {
    name: 'languages',
    type: 'multselect',
    label: 'Languages',
    value: null,
    placeholder: 'Select your languages',
    options: [
      { value: 'english', label: 'English' },
      { value: 'portuguese', label: 'Portuguese' },
    ],
    config: {
      allowEmpty: true,
      ColSize: 24,
    },
    validations: [z.array(z.string())],
  },
];

const handleSubmit = (values: any) => {
  console.log('Submitted values:', values);
};

const handleClear = () => {
  console.log('Form cleared');
};

const handleCancel = () => {
  console.log('Form canceled');
};

function App() {
  return (
    <div className="App">
      <DynamicForm
        data={formData as any}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onCancel={handleCancel}
        onErrorValidation={(errors) => console.log('Validation errors:', errors)}
        config={{
          showCancelButton: true,
          showClearButton: true,
        }}
      />
    </div>
  );
}

export default App;
