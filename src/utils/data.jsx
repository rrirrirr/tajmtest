// Combines list of object arrays by mutual key/keys
// @arrays is a list of objects with two props: an array and a key to combine by
// @arrays [{array: [], key: 'key'}, {...}, ...] | should look like this
// first element of list will be treated as a base
export function combineArraysByKey(arrays) {
  const keys = new Set()
  let base = null
  const keysHolder = []
  arrays.forEach(({ array, key, props, all }) => {
    const dataHolder = new Map()
    array.forEach((elem) => {
      if (key in elem === false) return
      if (!dataHolder.has(elem[key])) {
        dataHolder.set(elem[key], [])
        keys.add(elem[key])
      }
      dataHolder.get(elem[key]).push(
        all
          ? [[all, elem]]
          : props === 'all'
          ? elem
          : Object.entries(elem)
              .filter((pair) => pair[0] in props)
              .map((pair) => [props[pair[0]], pair[1]])
      )
    })
    if (base) {
      if (all) dataHolder.all = all
      keysHolder.push(dataHolder)
    } else {
      base = dataHolder
    }
  })

  let res = []
  base.forEach((list, key) => {
    res.push(
      ...list.map((elem) => {
        const elemCopy = { ...elem }
        keysHolder.forEach((holder, i) => {
          if (!holder.has(key)) return
          holder.get(key).length === 1
            ? holder
                .get(key)[0]
                .forEach((pair) => (elemCopy[pair[0]] = pair[1]))
            : holder.get(key).forEach((propPair) => {
                propPair.forEach((pair) => {
                  if (!elemCopy[pair[0]]?.length) elemCopy[pair[0]] = []
                  elemCopy[pair[0]].push(pair[1])
                })
              })
        })
        return elemCopy
      })
    )
  })
  return res
}
