import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver } from 'graphql';
import { path } from 'ramda';

export default class CardAccessDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { idArg = 'id' } = this.args;
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (parent, queryArgs, context, info) => {
      const id = path(idArg.split('.'))(queryArgs);
      const userId = context.userId;

      const card = context.repo.getCard(id);

      if (!card.user.id === userId) {
        throw new Error("You can't do that");
      }

      return resolve(parent, queryArgs, context, info);
    };
  }
}
