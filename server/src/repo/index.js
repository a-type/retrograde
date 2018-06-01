import uuid from 'uuid';
import low from 'lowdb/lib/fp';
import FileAsync from 'lowdb/adapters/FileAsync';
import R from 'ramda';

class Repo {
  constructor(db) {
    this.db = db;
  }

  createSession = async name => {
    const session = {
      id: uuid(),
      name,
      users: [],
      columns: [],
    };

    await this.db('sessions').write(R.assoc(session.id, session));
    return session;
  };

  getSession = id => this.db('sessions')(R.pathOr(null, [id]));

  updateSession = (id, args) => this.db(`sessions[${id}]`).write(R.merge(args));

  deleteSession = async id => {
    const session = await this.db(`sessions[${id}]`)();
    const columns = session.columns.map(this.deleteColumn);
    const users = session.users.map(this.deleteUser);
    await this.db('sessions').write(R.dissocPath([id]));
    return {
      ...session,
      columns,
      users,
    };
  };

  createUser = async (sessionId, name) => {
    const user = {
      id: uuid(),
      name,
    };

    await this.db('users').write(R.assoc(user.id, user));
    await this.db(`sessions[${sessionId}].users`).write(R.concat([user.id]));
    return user;
  };

  getUser = id => this.db('users')(R.pathOr(null, [id]));

  updateUser = (id, args) => this.db(`users[${id}]`).write(R.merge(args));

  deleteUser = async id => {
    const user = await this.getUser(id);
    await this.db('users').write(R.dissocPath([id]));
    return user;
  };

  createColumn = async (sessionId, name) => {
    const column = {
      id: uuid(),
      name,
      cards: [],
    };

    await this.db('columns').write(R.assoc(column.id, column));
    await this.db(`sessions[${sessionId}].columns`).write(
      R.concat([column.id]),
    );
    return column;
  };

  getColumn = id => this.db('columns')(R.pathOr(null, [id]));

  updateColumn = (id, args) => this.db(`columns[${id}]`).write(R.merge(args));

  deleteColumn = async id => {
    const column = await this.getColumn(id);
    const cards = column.cards.map(this.deleteCard.bind(this));
    await this.db('columns').write(R.dissocPath([id]));
    return {
      ...column,
      cards,
    };
  };

  createCard = async (columnId, userId, text = '') => {
    const card = {
      id: uuid(),
      author: userId,
      text,
    };

    await this.db('cards').write(R.assoc(card.id, card));
    await this.db(`columns[${columnId}].cards`).write(R.concat([card.id]));
    return card;
  };

  getCard = id => this.db('cards')(R.pathOr(null, [id]));

  updateCard = (id, args) => this.db(`cards[${id}]`).write(R.merge(args));

  deleteCard = async id => {
    const card = await this.getCard(id);
    await this.db('cards').write(R.dissocPath([id]));
    return card;
  };
}

const adapter = new FileAsync('db.json', {
  defaultValue: {
    users: {},
    sessions: {},
    columns: {},
    cards: {},
  },
});
const repo = low(adapter).then(db => new Repo(db));
export const load = () => repo;
