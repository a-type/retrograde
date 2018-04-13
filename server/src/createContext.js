import jwt from 'jsonwebtoken';
import repo from './repo';

const SECRET = process.env.JWT_SECRET || 'notsecret';

export default rawToken => {
  const token = jwt.verify(rawToken, SECRET);

  return {
    userId: token.userId,
    user: repo.getUser(token.userId),
    sessionId: token.sessionId,
    session: repo.getSession(token.sessionId),
  };
};
