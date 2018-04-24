import R from 'ramda'

// INPUT: [{ordering: 2, name: 'b'}, {ordering: 1, name: 'a'}]
// OUTPUT: [{ordering: 1, name: 'a'}, {ordering: 2, name: 'b'}]
export const sortObjectsByKeyAtoZ = (datas, fieldName, offset, limit) => R.pipe(
  R.values,
  R.sortBy(R.prop(fieldName)),
  R.slice(offset * limit, limit * (offset + 1))
)(datas)

export const sortObjectsByKeyZtoA = (datas, fieldName, offset, limit) => R.reverse(sortObjectsByKeyAtoZ(datas, fieldName, offset, limit))
