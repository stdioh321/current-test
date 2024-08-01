import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
} from "antd";
import { z, ZodError, ZodOptional } from "zod";
import moment from "moment";
import InputMask from "react-input-mask";

const DynamicForm = ({
  data,
  onSubmit,
  onErrorValidation,
  onCancel,
  onClear,
  config = { showCancelButton: false, showClearButton: false },
}) => {
  const [form] = Form.useForm();
  const [validationErrors, setValidationErrors] = useState([]);

  const [dependencies, setDependencies] = useState({});

  useEffect(() => {
    // Build dependencies map
    const depMap = data.reduce((acc, field) => {
      if (field.config?.dependsOn) {
        if (!acc[field.config.dependsOn]) {
          acc[field.config.dependsOn] = [];
        }
        acc[field.config.dependsOn].push(field.name);
      }
      return acc;
    }, {});
    setDependencies(depMap);
  }, [data]);

  const handleFinish = (values) => {
    try {
      const validationSchema = z.object(
        data.reduce((acc, field) => {
          const { name, validations } = field;
          acc[name] = validations.length > 0 ? z.union(validations) : z.any();
          return acc;
        }, {})
      );
      validationSchema.parse(values);
      setValidationErrors([]);
      onSubmit(values);
    } catch (err) {
      if (err instanceof ZodError) {
        const errorList = err.errors.reduce((acc, error) => {
          acc[error.path[0]] = {
            validateStatus: "error",
            help: error.message,
          };
          return acc;
        }, {});
        form.setFields(
          Object.keys(errorList).map((key) => ({
            name: key,
            ...errorList[key],
          }))
        );
        setValidationErrors(err.errors);
        onErrorValidation(err.errors);
      }
    }
  };

  const handleClear = () => {
    form.resetFields();
    setValidationErrors([]);
    if (onClear) onClear();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const renderField = (field) => {
    const {
      name,
      type,
      label,
      value,
      options,
      placeholder,
      config,
      validations,
    } = field;

    let ruleRequired = { required: true };

    const rules = [
      ...validations.map((validation) => {
        if (validation instanceof ZodOptional) {
          ruleRequired = { required: false };
        }
        return {
          validator: async (_, value) => {
            try {
              await validation.parseAsync(value);
            } catch (e) {
              return Promise.reject(e.errors[0].message);
            }
          },
        };
      }),
      ...(config?.dependsOn
        ? [
            {
              validator: (_, value) => {
                const dependsOnFields = dependencies[config.dependsOn];
                if (dependsOnFields) {
                  const parentValue = form.getFieldValue(config.dependsOn);
                  if (
                    parentValue === undefined ||
                    parentValue === null ||
                    parentValue === ""
                  ) {
                    return Promise.reject(
                      `${config.dependsOn} must be filled out first`
                    );
                  }
                }
                return Promise.resolve();
              },
            },
          ]
        : []),
    ];

    const commonProps = {
      style: { width: "100%" },
      placeholder,
    };

    rules.push(ruleRequired);

    switch (type) {
      case "string":
        return (
          <Form.Item
            name={name}
            label={label}
            initialValue={value}
            rules={rules}
          >
            {config?.mask ? (
              <InputMask mask={config.mask}>
                {(inputProps) => <Input {...inputProps} {...commonProps} />}
              </InputMask>
            ) : (
              <Input {...commonProps} />
            )}
          </Form.Item>
        );
      case "email":
        return (
          <Form.Item
            name={name}
            label={label}
            initialValue={value}
            rules={[{ type: "email" }, ...rules]}
          >
            <Input {...commonProps} />
          </Form.Item>
        );
      case "number":
        return (
          <Form.Item
            name={name}
            label={label}
            initialValue={value}
            rules={rules}
          >
            <InputNumber
              {...commonProps}
              min={config?.allowNegative ? undefined : 0}
            />
          </Form.Item>
        );
      case "date":
        return (
          <Form.Item
            name={name}
            label={label}
            initialValue={value ? moment(value) : null}
            rules={rules}
          >
            <DatePicker
              {...commonProps}
              format={config?.format || "DD/MM/YYYY"}
              showTime={config?.time || false}
            />
          </Form.Item>
        );
      case "currency":
        return (
          <Form.Item
            name={name}
            label={label}
            initialValue={value}
            rules={rules}
          >
            <Input
              {...commonProps}
              prefix={config?.prefix || ""}
              type="number"
              step={config?.separator === "." ? "0.01" : "0,01"}
            />
          </Form.Item>
        );
      case "select":
        return (
          <Form.Item
            name={name}
            label={label}
            initialValue={value}
            rules={config?.allowEmpty ? rules : [...rules, { required: true }]}
          >
            <Select
              {...commonProps}
              allowClear={config?.allowEmpty}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {options.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      case "multiselect":
        return (
          <Form.Item
            name={name}
            label={label}
            initialValue={value}
            rules={config?.allowEmpty ? rules : [...rules, { required: true }]}
          >
            <Select
              {...commonProps}
              mode="multiple"
              allowClear={config?.allowEmpty}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {options.map((option) => (
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
