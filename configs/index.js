import GraphQL, {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLScalarType,
} from 'graphql';
import Product from '../app/product/model.js';
import Supplier from '../app/supplier/model.js';

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  serialize: (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  },
});

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: {
    _id: { type: GraphQL.GraphQLID },
    name: { type: GraphQL.GraphQLString },
    slug: { type: GraphQL.GraphQLString },
    description: { type: GraphQL.GraphQLString },
    stock: { type: GraphQL.GraphQLInt },
    price: { type: GraphQL.GraphQLFloat },
    status: { type: GraphQL.GraphQLString },
    supplier: { type: GraphQL.GraphQLString },
    createdAt: { type: DateTime },
    updatedAt: { type: DateTime },
  },
});

const SupplierType = new GraphQLObjectType({
  name: 'Supplier',
  fields: {
    _id: { type: GraphQL.GraphQLID },
    name: { type: GraphQL.GraphQLString },
    description: { type: GraphQL.GraphQLString },
    type: { type: GraphQL.GraphQLString },
    sizeOfMembers: { type: GraphQL.GraphQLInt },
    address: { type: GraphQL.GraphQLString },
    contact: { type: GraphQL.GraphQLString },
    createdAt: { type: DateTime },
    updatedAt: { type: DateTime },
  },
});

const ProductInputType = new GraphQLInputObjectType({
  name: 'ProductInput',
  fields: {
    name: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString) },
    description: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString) },
    stock: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt) },
    price: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLFloat) },
    status: { type: GraphQL.GraphQLString },
    supplier: { type: GraphQL.GraphQLString },
  },
});

const SupplierInputType = new GraphQLInputObjectType({
  name: 'SupplierInput',
  fields: {
    name: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString) },
    description: { type: GraphQL.GraphQLString },
    type: { type: GraphQL.GraphQLString },
    sizeOfMembers: { type: GraphQL.GraphQLInt },
    address: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString) },
    contact: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString) },
  },
});

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      getAllProducts: {
        type: new GraphQL.GraphQLList(ProductType),
        resolve: async () => {
          try {
            const result = await Product.find();
            return result;
          } catch (err) {
            throw new Error(err);
          }
        },
      },
      getProduct: {
        type: ProductType,
        args: {
          _id: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString) },
        },
        resolve: async (parent, args, context) => {
          try {
            const result = await Product.findById(args._id);
            return result;
          } catch (err) {
            throw new Error(
              JSON.stringify({
                status: 404,
                message: 'Product not found',
              })
            );
          }
        },
      },
      getAllSuppliers: {
        type: new GraphQL.GraphQLList(SupplierType),
        resolve: async () => {
          try {
            const result = await Supplier.find();
            return result;
          } catch (err) {
            throw new Error(err);
          }
        },
      },
      getSupplier: {
        type: SupplierType,
        args: {
          _id: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString) },
        },
        resolve: async (parent, args, context) => {
          try {
            const result = await Supplier.findById(args._id);
            return result;
          } catch (err) {
            throw new Error(
              JSON.stringify({
                status: 404,
                message: 'Supplier not found',
              })
            );
          }
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createProduct: {
        type: ProductType,
        args: {
          input: { type: new GraphQL.GraphQLNonNull(ProductInputType) },
        },
        resolve: async (parent, args, context) => {
          try {
            const slug = args.input.name.toLowerCase().split(' ').join('-');
            const result = await Product.create({ slug, ...args.input });
            return result;
          } catch (err) {
            throw new Error(
              JSON.stringify({
                status: 500,
                message: 'Failed Create Product',
              })
            );
          }
        },
      },
      updateProduct: {
        type: ProductType,
        args: {
          _id: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString) },
          input: { type: ProductInputType },
        },
        resolve: async (parent, args, context) => {
          try {
            const slug = args.input.name.toLowerCase().split(' ').join('-');
            const result = await Product.findByIdAndUpdate(
              args._id,
              {
                slug,
                ...args.input,
              },
              { new: true }
            );
            return result;
          } catch (err) {
            throw new Error(
              JSON.stringify({
                status: 500,
                message: 'Failed Update Product',
              })
            );
          }
        },
      },
      deleteProduct: {
        type: ProductType,
        args: {
          _id: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString) },
        },
        resolve: async (parent, args, context) => {
          try {
            const result = await Product.findOneAndDelete({ _id: args._id });
            return result;
          } catch (err) {
            throw new Error(
              JSON.stringify({
                status: 500,
                message: 'Failed Delete Product',
              })
            );
          }
        },
      },
      createSupplier: {
        type: SupplierType,
        args: {
          input: { type: new GraphQL.GraphQLNonNull(SupplierInputType) },
        },
        resolve: async (parent, args, context) => {
          try {
            const result = await Supplier.create(args.input);
            return result;
          } catch (err) {
            throw new Error(
              JSON.stringify({
                status: 500,
                message: 'Failed Create Supplier',
              })
            );
          }
        },
      },
      updateSupplier: {
        type: SupplierType,
        args: {
          _id: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString) },
          input: { type: SupplierInputType },
        },
        resolve: async (parent, args, context) => {
          try {
            const result = await Supplier.findByIdAndUpdate(
              args._id,
              args.input,
              { new: true }
            );
            return result;
          } catch (err) {
            throw new Error(
              JSON.stringify({
                status: 500,
                message: 'Failed Update Supplier',
              })
            );
          }
        },
      },
      deleteSupplier: {
        type: SupplierType,
        args: {
          _id: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString) },
        },
        resolve: async (parent, args, context) => {
          try {
            const result = await Supplier.findOneAndDelete({ _id: args._id });
            return result;
          } catch (err) {
            throw new Error(
              JSON.stringify({
                status: 500,
                message: 'Failed Delete Supplier',
              })
            );
          }
        },
      },
    },
  }),
});

// export const typeDefs = buildSchema(`
//  scalar DateTime

//   type Product {
//     _id: ID
//     name: String
//     slug: String
//     description: String
//     stock: Int
//     price: Float
//     status: String
//     supplier: String
//     createdAt: DateTime
//     updatedAt: DateTime
//   }

//   type Supplier {
//     _id: ID
//     name: String
//     description: String
//     type: String
//     sizeOfMembers: Int
//     address: String
//     contact: String
//     createdAt: DateTime
//     updatedAt: DateTime
//   }

//   input ProductInput {
//     name: String!
//     description: String!
//     stock: Int!
//     price: Float!
//     status: String
//     supplier: String
//   }

//   input SupplierInput {
//     name: String!
//     description: String
//     type: String
//     sizeOfMembers: Int
//     address: String!
//     contact: String!
//   }

//   type Query {
//     getAllProducts: [Product!]
//     getProduct(_id: ID!): Product!
//     getAllSuppliers: [Supplier!]
//     getSupplier(_id: ID!): Supplier!
//   }

//   type Mutation {
//     createProduct(input: ProductInput!): Product!
//     updateProduct(_id: ID!, input: ProductInput!): Product!
//     deleteProduct(_id: ID!): Product!
//     createSupplier(input: SupplierInput!): Supplier!
//     updateSupplier(_id: ID!, input: SupplierInput!): Supplier!
//     deleteSupplier(_id: ID!): Supplier!
//   }
// `);

// export const resolvers = {
//   DateTime: DateTime,
//   Query: {
//     getAllProducts: async () => {
//       try {
//         const result = await Product.find();
//         return result;
//       } catch (err) {
//         throw new Error(err);
//       }
//     },
//     getProduct: async ({ _id }) => {
//       try {
//          const result = await Product.findById(_id);
//          return result;
//       } catch (err) {
//          throw new Error(
//          JSON.stringify({
//             status: 404,
//             message: 'Product not found',
//          })
//       );
//      }
//     },
//    getAllSuppliers: async () => {
//      try {
//        const result = await Supplier.find();
//        return result;
//      } catch (err) {
//        throw new Error(err);
//      }
//    },
//    getSupplier: async ({ _id }) => {
//      try {
//        const result = await Supplier.findById(_id);
//        return result;
//      } catch (err) {
//        throw new Error(
//          JSON.stringify({
//            status: 404,
//            message: 'Supplier not found',
//          })
//        );
//      }
//    },
//   },
//   Mutation: {
//     createProduct: async ({ input }) => {
//      try {
//        const slug = input.name.toLowerCase().split(' ').join('-');
//        const result = await Product.create({ slug, ...input });
//        return result;
//      } catch (err) {
//        throw new Error(
//          JSON.stringify({
//            status: 500,
//            message: 'Failed Create Product',
//          })
//        );
//      }
//     },
//     updateProduct: async ({ _id, input }) => {
//      try {
//        const slug = input.name.toLowerCase().split(' ').join('-');
//        const result = await Product.findByIdAndUpdate(
//          _id,
//          {
//            slug,
//            ...input,
//          },
//          { new: true }
//        );
//        return result;
//      } catch (err) {
//        throw new Error(
//          JSON.stringify({
//            status: 500,
//            message: 'Failed Update Product',
//          })
//        );
//      }
//     },
//     deleteProduct: async ({ _id }) => {
//      try {
//        const result = await Product.findOneAndDelete({ _id });
//        return result;
//      } catch (err) {
//        throw new Error(
//          JSON.stringify({
//            status: 500,
//            message: 'Failed Delete Product',
//          })
//        );
//      }
//     },
//     createSupplier: async ({ input }) => {
//      try {
//        const result = await Supplier.create(input);
//        return result;
//      } catch (err) {
//        throw new Error(
//          JSON.stringify({
//            status: 500,
//            message: 'Failed Create Supplier',
//          })
//        );
//      }
//     },
//     updateSupplier: async ({ _id, input }) => {
//      try {
//        const result = await Supplier.findByIdAndUpdate(
//          _id,
//          input,
//          { new: true }
//        );
//        return result;
//      } catch (err) {
//        throw new Error(
//          JSON.stringify({
//            status: 500,
//            message: 'Failed Update Supplier',
//          })
//        );
//      }
//     },
//     deleteSupplier: async ({ _id }) => {
//      try {
//        const result = await Supplier.findOneAndDelete({ _id });
//        return result;
//      } catch (err) {
//        throw new Error(
//          JSON.stringify({
//            status: 500,
//            message: 'Failed Delete Supplier',
//          })
//        );
//      }
//     },
//   },
// };