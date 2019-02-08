import jwt from 'jsonwebtoken';
import loadRepo, { Repo } from './repo';
import pubsub from './pubsub';
import { User, Session } from 'types';

const SECRET = process.env.JWT_SECRET || 'notsecret';

export type Context = {
  repo: Repo;
  pubsub: typeof pubsub;
  userId: string;
  user: User;
  sessionId: string;
  session: Session;
};

export default async (rawToken: string) => {
  const repo = await loadRepo();
  const token = rawToken ? jwt.verify(rawToken, SECRET) : null;

  return {
    userId: token ? token.userId : null,
    user: token ? repo.getUser(token.userId) : null,
    sessionId: token ? token.sessionId : null,
    session: token ? repo.getSession(token.sessionId) : null,
    repo,
    pubsub,
  };
};
