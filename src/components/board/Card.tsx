import * as React from 'react';
import styled from 'styled-components';

const CardBorder = styled.div`
  padding: 20px;
  border-radius: 10px;
  border: 2px solid gray;
  width: 400px;
`;

interface CardProps {
  id: string;
  text: string;
  category: string;
  tags: string[];
}

const Card: React.SFC<CardProps> = ({ text }) => {
  return <CardBorder>{text}</CardBorder>;
};

export default Card;
