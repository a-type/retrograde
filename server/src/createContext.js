import jwt from 'jsonwebtoken';
import { load } from './repo';
import pubsub from './pubsub';

const SECRET = process.env.JWT_SECRET || 'notsecret';

export default async rawToken => {
  const repo = await load();
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
