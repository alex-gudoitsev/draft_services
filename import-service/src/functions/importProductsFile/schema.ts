export default {
  type: 'object',
  queryStringParameters: {
    name: { type: 'string', required: true },
  },
} as const;
