export type User = {
  id: string;
  name: string;
};

export type Card = {
  id: string;
  text: string;
  tags: string[];
  authorId?: string;
  author?: User;
};

export type Session = {
  id: string;
  name: string;
  cardIds?: string[];
  userIds?: string[];
  users?: User[];
  cards?: Card[];
};
