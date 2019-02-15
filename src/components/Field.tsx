import React, { SFC, HTMLAttributes } from 'react';
import styled from 'styled-components';

const FieldContainer = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  required?: boolean;
}

const Field: SFC<FieldProps> = ({ label, required, children, ...rest }) => (
  <FieldContainer {...rest}>
    <Label>
      {label}
      {required ? '' : ' (optional)'}
    </Label>
    {children}
  </FieldContainer>
);

export default Field;
