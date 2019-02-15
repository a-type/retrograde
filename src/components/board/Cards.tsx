import React, { SFC } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import { Box } from 'grommet';
import { pathOr } from 'ramda';
import Card from '@/components/board/Card';

const GetCards = gql`
  query GetCards {
    session {
      id
      cards {
        id
        text
        category
        tags
      }
    }
  }
`;

type CardResult = {
  id: string;
  text: string;
  category: string;
  tags: string[];
};

type GetCardsResult = {
  session: {
    id: string;
    cards: CardResult[];
  };
};

interface CardsProps {}

const Cards: SFC<CardsProps> = ({}) => {
  const { data, error } = useQuery<GetCardsResult>(GetCards);

  if (error) {
    return <div>{error.message}</div>;
  }

  const cards = pathOr([], ['session', 'cards'], data) as CardResult[];

  return (
    <Box>
      {cards.map(card => (
        <Card key={card.id} {...card} />
      ))}
    </Box>
  );
};

export default Cards;
