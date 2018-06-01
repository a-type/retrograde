import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver } from 'graphql';
import { path } from 'ramda';

export default class ColumnAccessDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { idArg = 'id' } = this.args;
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (parent, queryArgs, context, info) => {
      const id = path(idArg.split('.'))(queryArgs);
      const sessionId = context.sessionId;
      if (!sessionId) {
        throw new Error("You haven't joined a session");
      }

      const column = context.repo.getColumn(id);
      const session = context.repo.getSession(sessionId);

      if (!session.columns.includes(column)) {
        throw new Error("You can't do that");
      }

      return resolve(parent, queryArgs, context, info);
    };
  }
}
