const uuid = require('uuid');

const users = {};
const sessions = {};
const columns = {};
const cards = {};

class Repo {
  createSession(name) {
    const session = {
      id: uuid(),
      name,
      users: [],
      columns: [],
    };

    sessions[session.id] = session;
    return session;
  }

  getSession(id) {
    const session = sessions[id];
    return {
      ...session,
      columns: session.columns.map(this.getColumn),
      users: session.users.map(this.getUser),
    };
  }

  updateSession(id, args) {
    Object.apply(sessions[id], args);
    return this.getSession(id);
  }

  deleteSession(id) {
    const session = sessions[id];
    const columns = session.columns.map(this.deleteColumn);
    const users = session.users.map(this.deleteUser);
    delete sessions[id];
    return {
      ...session,
      columns,
      users,
    };
  }

  createUser(sessionId, name) {
    const user = {
      id: uuid(),
      name,
    };

    users[user.id] = user;
    sessions[sessionId].users.push(user.id);
    return user;
  }

  getUser(id) {
    return users[id];
  }

  listUsers(sessionId) {
    return sessions[sessionId].users.map(this.getUser);
  }

  updateUser(id, args) {
    Object.apply(users[id], args);
    return this.getUser(id);
  }

  deleteUser(id) {
    const user = users[id];
    delete users[id];
    return user;
  }

  createColumn(sessionId, name) {
    const column = {
      id: uuid(),
      name,
    };

    columns[column.id] = column;
    sessions[sessionId].columns.push(column.id);
    return column;
  }

  getColumn(id) {
    const column = columns[id];
    return {
      ...column,
      cards: column.cards.map(this.getCard),
    };
  }

  listColumns(sessionId) {
    return sessions[sessionId].columns.map(this.getColumn);
  }

  updateColumn(id, args) {
    Object.apply(columns[id], args);
    return this.getColumn(id);
  }

  deleteColumn(id) {
    const column = columns[id];
    const cards = column.cards.map(this.deleteCard);
    delete columns[id];
    return {
      ...column,
      cards,
    };
  }

  createCard(columnId, userId, text = '') {
    const card = {
      id: uuid(),
      user: userId,
      text,
    };

    cards[id] = card;
    columns[columnId].cards.push(card.id);
    return card;
  }

  getCard(id) {
    const card = cards[id];
    return {
      ...card,
      user: this.getUser(card.user),
    };
  }

  listCards(columnId) {
    return columns[columnId].cards.map(this.getCard);
  }

  updateCard(id, args) {
    const card = this.getCard(id);
    Object.apply(card, {
      text: args.text,
    });
    return card;
  }

  deleteCard(id) {
    const card = getCard(id);
    delete cards[id];
    return card;
  }
}

module.exports = new Repo();
