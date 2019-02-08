import uuid from 'uuid';
import low from 'lowdb/lib/fp';
import FileAsync from 'lowdb/adapters/FileAsync';
import R from 'ramda';
import { User, Card, Session } from '../types';

export class Repo {
  db: any;

  constructor(db) {
    this.db = db;
  }

  createSession = async (name: string): Promise<Session> => {
    const session: Session = {
      id: uuid(),
      name,
      userIds: [],
      cardIds: [],
      categories: ['Start', 'Stop', 'Continue'],
    };

    await this.db('sessions').write(R.assoc(session.id, session));
    return session;
  };

  getSession = (id: string): Promise<Session> =>
    this.db('sessions')(R.pathOr(null, [id]));

  updateSession = (id: string, args: Partial<Session>): Promise<Session> =>
    this.db(`sessions[${id}]`).write(R.merge(args));

  deleteSession = async (id: String): Promise<Session> => {
    const session = await this.db(`sessions[${id}]`)();
    const users = session.users.map(this.deleteUser);
    await this.db('sessions').write(R.dissocPath([id]));
    return {
      ...session,
      users,
    };
  };

  createUser = async (sessionId: string, name: string): Promise<User> => {
    const user: User = {
      id: uuid(),
      name,
    };

    await this.db('users').write(R.assoc(user.id, user));
    await this.db(`sessions[${sessionId}].userIds`).write(R.concat([user.id]));
    return user;
  };

  getUser = (id: string): Promise<User> =>
    this.db('users')(R.pathOr(null, [id]));

  updateUser = (id: string, args: Partial<User>): Promise<User> =>
    this.db(`users[${id}]`).write(R.merge(args));

  deleteUser = async (id: string): Promise<User> => {
    const user = await this.getUser(id);
    await this.db('users').write(R.dissocPath([id]));
    return user;
  };

  createCard = async (
    sessionId: string,
    userId: string,
    init: Partial<Card>,
  ): Promise<Card> => {
    const card: Card = {
      text: '',
      category: '',
      tags: [],
      ...init,
      id: uuid(),
      authorId: userId,
    };

    await this.db('cards').write(R.assoc(card.id, card));
    await this.db(`sessions[${sessionId}].cardIds`).write(R.concat([card.id]));
    return card;
  };

  getCard = (id: string): Promise<Card> =>
    this.db('cards')(R.pathOr(null, [id]));

  updateCard = (id: string, args: Partial<Card>): Promise<Card> =>
    this.db(`cards[${id}]`).write(R.merge(args));

  deleteCard = async (id: string): Promise<Card> => {
    const card = await this.getCard(id);
    await this.db('cards').write(R.dissocPath([id]));
    return card;
  };
}

const adapter = new FileAsync('db.json', {
  defaultValue: {
    users: {},
    sessions: {},
    cards: {},
  },
});
const loadRepo = (): Promise<Repo> => low(adapter).then(db => new Repo(db));

export default loadRepo;
