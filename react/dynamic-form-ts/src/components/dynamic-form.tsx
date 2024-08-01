import React, { ReactNode, useEffect, useState } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button, Row, Col } from 'antd';
import { z, ZodError, ZodSchema } from 'zod';
import dayjs from 'dayjs';
import InputMask, { ReactInputMask } from 'react-input-mask';

type FieldType = 'string' | 'email' | 'number' | 'date' | 'currency' | 'select' | 'multselect';

interface FieldConfig {
    mask?: string;
    allowNegative?: boolean;
    format?: string;
    time?: boolean;
    prefix?: string;
    separator?: string;
    allowEmpty?: boolean;
    ColSize?: number;
    dependsOn?: string;
}

interface Field {
    name: string;
    type: FieldType;
    label: string;
    value?: string;
    options?: { value: any; label: string }[];
    placeholder?: string;
    config?: FieldConfig;
    validations: ZodSchema[];
}

interface DynamicFormProps {
    data: Field[];
    onSubmit: (values: any) => void;
    onErrorValidation: (errors: ZodError[]) => void;
    onCancel?: () => void;
    onClear?: () => void;
    config?: {
        showCancelButton?: boolean;
        showClearButton?: boolean;
    };
}

const DynamicForm: React.FC<DynamicFormProps> = ({
    data,
    onSubmit,
    onErrorValidation,
    onCancel,
    onClear,
    config = { showCancelButton: false, showClearButton: false },
}) => {
    const [form] = Form.useForm();
    const [dependencies, setDependencies] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        const depMap: { [key: string]: string[] } = data.reduce((acc: any, field: any) => {
            if (field.config?.dependsOn) {
                if (!acc[field.config.dependsO]) {
                    acc[field.config.dependsOn] = [];
                }
                acc[field.config.dependsOn].push(field.name);
            }
            return acc;
        }, {});
        setDependencies(depMap);
    }, [data]);

    const handleFinish = (values: any) => {
        try {
            const validationSchema = z.object(
                data.reduce((acc, field) => {
                    const { name, validations } = field;
                    acc[name] = validations.length > 0 ? z.union(validations as any) : z.any();
                    return acc;
                }, {} as { [key: string]: ZodSchema })
            );
            validationSchema.parse(values);
            onSubmit(values);
        } catch (err) {
            if (err instanceof ZodError) {
                const errorList = err.errors.reduce((acc, error) => {
                    acc[error.path[0] as string] = {
                        validateStatus: 'error',
                        help: error.message,
                    };
                    return acc;
                }, {} as { [key: string]: { validateStatus: 'error'; help: string } });
                form.setFields(Object.keys(errorList).map((key) => ({
                    name: key,
                    ...errorList[key],
                })));
                onErrorValidation(err.errors as any);
            }
        }
    };

    const handleClear = () => {
        form.resetFields();
        if (onClear) onClear();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
    };

    const renderField = (field: Field) => {
        const { name, type, label, value, options, placeholder, config, validations } = field;

        const rules = [
            ...validations.map((validation) => ({
                validator: async (_: any, value: any) => {
                    try {
                        await validation.parseAsync(value);
                    } catch (e: any) {
                        return Promise.reject(e.errors[0].message);
                    }
                },
            })),
            ...(config?.dependsOn ? [{
                validator: (_: any, value: any) => {
                    const dependsOnFields = dependencies[config.dependsOn as any];
                    if (dependsOnFields) {
                        const parentValue = form.getFieldValue(config.dependsOn);
                        if (parentValue === undefined || parentValue === null || parentValue === '') {
                            return Promise.reject(`${config.dependsOn} must be filled out first`);
                        }
                    }
                    return Promise.resolve();
                },
            }] : []),
        ];

        const commonProps = {
            style: { width: '100%' },
            placeholder,
        };

        switch (type) {
            case 'string':
                const currentInput: any = (inputProps: any) => <Input {...inputProps} {...commonProps} />;
                return (
                    <Form.Item name={name} label={label} initialValue={value} rules={rules}>
                        {config?.mask ? (
                            <InputMask mask={config.mask}>
                                {currentInput}
                            </InputMask>
                        ) : (
                            <Input {...commonProps} />
                        )}
                    </Form.Item>
                );
            case 'email':
                return (
                    <Form.Item name={name} label={label} initialValue={value} rules={[{ type: 'email' }, ...rules]}>
                        <Input {...commonProps} />
                    </Form.Item>
                );
            case 'number':
                return (
                    <Form.Item name={name} label={label} initialValue={value} rules={rules}>
                        <InputNumber {...commonProps} min={config?.allowNegative ? undefined : 0} />
                    </Form.Item>
                );
            case 'date':
                return (
                    <Form.Item name={name} label={label} initialValue={value ? dayjs(value) : null} rules={rules}>
                        <DatePicker {...commonProps} format={config?.format || 'DD/MM/YYYY'} showTime={config?.time || false} />
                    </Form.Item>
                );
            case 'currency':
                return (
                    <Form.Item name={name} label={label} initialValue={value} rules={rules}>
                        <Input
                            {...commonProps}
                            prefix={config?.prefix || ''}
                            type="number"
                            step={config?.separator === '.' ? '0.01' : '0,01'}
                        />
                    </Form.Item>
                );
            case 'select':
                return (
                    <Form.Item name={name} label={label} initialValue={value} rules={config?.allowEmpty ? rules : [...rules, { required: true }]}>
                        <Select
                            {...commonProps}
                            allowClear={config?.allowEmpty}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.children as any).toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {options?.map((option) => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                );
            case 'multselect':
                return (
                    <Form.Item name={name} label={label} initialValue={value} rules={config?.allowEmpty ? rules : [...rules, { required: true }]}>
                        <Select
                            {...commonProps}
                            mode="multiple"
                            allowClear={config?.allowEmpty}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.children as any).toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {options?.map((option) => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                );
            default:
                return null;
        }
    };

    return (
        <Form form={form} onFinish={handleFinish} layout="vertical">
            <Row gutter={16}>
                {data.map((field) => (
                    <Col span={field.config?.ColSize || 12} key={field.name}>
                        {renderField(field)}
                    </Col>
                ))}
            </Row>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
                {config.showClearButton && (
                    <Button type="default" onClick={handleClear}>
                        Clear
                    </Button>
                )}
                {config.showCancelButton && (
                    <Button type="default" onClick={handleCancel}>
                        Cancel
                    </Button>
                )}
            </Form.Item>
        </Form>
    );
};

export default DynamicForm;
