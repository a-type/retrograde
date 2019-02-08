import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver } from 'graphql';
import { path } from 'ramda';

export default class InSessionDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { idArg = 'id' } = this.args;
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (parent, queryArgs, context, info) => {
      const id = path(idArg.split('.'))(queryArgs);
      if (id !== context.sessionId) {
        throw new Error("Sorry, you can't do that");
      }
      return resolve(parent, queryArgs, context, info);
    };
  }
}
