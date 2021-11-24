import { permissions } from './permissions'
import { APP_SECRET, getUserId } from './utils'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { applyMiddleware } from 'graphql-middleware'
import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
  booleanArg,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'
import { isContext } from 'vm'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.user.findMany()
      },
    })

    t.nullable.field('me', {
      type: 'User',
      resolve: (parent, args, context: Context) => {
        const userId = getUserId(context)
        return context.prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        })
      },
    })

    t.nonNull.list.nonNull.field('userNotes', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        const userId = getUserId(context)
        return context.prisma.user.findMany({
          where: {
            id: Number(userId),
          }
        })
      },
    })

    t.nonNull.list.nonNull.field('allNotes', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        const userId = 1;
        return context.prisma.user.findMany({
          where: { id: 1 },
          include: {
            note: {
              orderBy: {
                createdAt: "desc"
              }
            }
          }
        })
      }
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        const hashedPassword = await hash(args.password, 10)
        const user = await context.prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
          },
        })
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { email, password }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('saveNote', {
      type: 'Note',
      args: {
        note: stringArg(),
      },
      resolve: (_, { note }, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error("Could not authenticate user.");

        return context.prisma.note.create({
          data: {
            note: note as string,
            creator: { connect: {id: Number(userId)}},
          },
        })
      },
    })

    t.field('deleteNote', {
      type: 'Note',
      args: {
        noteId: intArg(),
      },
      resolve: (_, { noteId }, context: Context) => {
        return context.prisma.note.delete( {
          where: {
            id: noteId as number,
          },
        })
      }
    })

    t.field('changeStatus', {
      type: 'Note',
      args: {
        noteId: intArg(),
        completed: booleanArg()
      },
      resolve: (_, { noteId, completed }, context: Context) => {
        return context.prisma.note.update({
          where: {
            id: noteId as number,
          },
          data: {
            completed: completed as boolean
          }
        })
      }
    })
  }
 })

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.nonNull.string('email')
    t.nonNull.list.nonNull.field('notes', {
      type: 'Note',
      resolve: (parent, _, context: Context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .note()
      },
    })
  },
})

const Note = objectType({
  name: 'Note',
  definition(t) {

    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.string('note')
    t.nonNull.boolean('completed')
    t.field('creator', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.prisma.note
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .creator()
      },
    })
  },
})

const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

const PostOrderByUpdatedAtInput = inputObjectType({
  name: 'PostOrderByUpdatedAtInput',
  definition(t) {
    t.nonNull.field('updatedAt', { type: 'SortOrder' })
  },
})

const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id')
    t.string('email')
  },
})

const PostCreateInput = inputObjectType({
  name: 'PostCreateInput',
  definition(t) {
    t.nonNull.string('title')
    t.string('content')
  },
})

const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.string('name')
    t.list.nonNull.field('posts', { type: 'PostCreateInput' })
  },
})

const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
})

const schemaWithoutPermissions = makeSchema({
  types: [
    Query,
    Mutation,
    //Post,
    Note,
    User,
    AuthPayload,
    UserUniqueInput,
    UserCreateInput,
    PostCreateInput,
    SortOrder,
    PostOrderByUpdatedAtInput,
    DateTime,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

export const schema = applyMiddleware(schemaWithoutPermissions, permissions)
