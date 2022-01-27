const parseFields = fields => {
  if (!fields) return ''
  return Object.keys(fields).reduce(
    (acc, key) => (
      (acc += key + ' '),
      fields[key] === true
        ? acc
        : acc + `{ ${parseFields(fields[key]).trim()} }`
    ),
    ''
  )
}

const parseArgs = args => {
  if (!args) return ''
  return Object.entries(args).reduce(
    (acc, [name, value]) => (
      (acc &&= acc + ' '),
      (acc += ['string', 'number', 'boolean'].includes(typeof value)
        ? `${name}: ${typeof value === 'string' ? `"${value}"` : value}`
        : `${name}: ${value.length > 1 ? '[' : ''}${value
            .map(val =>
              typeof val === 'string' // catch enums
                ? val
                : `{ ${Object.entries(val)
                    .map(([name, value]) => `${name}: "${value}"`)
                    .join(', ')} }`
            )
            .join(', ')}${value.length > 1 ? ']' : ''}`)
    ),
    ''
  )
}

const parseOps = ops =>
  ops
    .map(({ name, args, fields }) => {
      const selectionSet =
        args.length === 0 ? name : `${name} (${parseArgs(args)})`
      return `${selectionSet} { ${parseFields(fields)} }`
    })
    .join(' ')

/**
 * @typedef Operation
 * @property {string} name
 * @property {Object<string, any>} [args]
 * @property {Object<string, any>} fields
 */

/**
 * @summary Parse a JavaScript object describing a GraphQL into a usable query
 * @param {(Operation|Operation[])} ops
 * @example
 * import { objq } from 'objql'
 *
 * const query = objq({
 *    name: 'transactions',
 *    args: { first: 5, sort: ['HEIGHT_ASC'] },
 *    fields: {
 *       edges: { node: { id: true } },
 *    },
 * })
 * @public
 * @returns {string} GrahpQL query
 */
export const objq = ops =>
  `query { ${parseOps(Array.isArray(ops) === true ? ops : [ops])} }`
