// this is basically a placeholder until Formik supports hooks
import { useState, ChangeEvent } from 'react';

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

export interface FieldProps<ElementType extends FieldElement> {
  onChange(ev: ChangeEvent<ElementType>): any;
  value: any;
  name: string;
}

/**
 * Returns props you should spread to the field input
 */
export default <ElementType extends FieldElement>(
  fieldName: string,
  initialValue: any = '',
): FieldProps<ElementType> => {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    onChange: (ev: ChangeEvent<ElementType>) => {
      setValue(ev.target.value);
    },
    name: fieldName,
  };
};
