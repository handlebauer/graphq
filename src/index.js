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

export const objq = ops =>
  `query { ${parseOps(Array.isArray(ops) === true ? ops : [ops])} }`
