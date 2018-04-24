import R from 'ramda'

// INPUT: [{ordering: 2, name: 'b'}, {ordering: 1, name: 'a'}]
// OUTPUT: [{ordering: 1, name: 'a'}, {ordering: 2, name: 'b'}]
export const sortObjectsByKeyAtoZ = (datas, fieldName, offset, limit) => R.pipe(
  R.values,
  R.sortBy(R.prop(fieldName)),
  R.slice(offset * limit, limit * (offset + 1))
)(datas)

export const sortObjectsByKeyZtoA = (datas, fieldName, offset, limit) => R.reverse(sortObjectsByKeyAtoZ(datas, fieldName, offset, limit))

export const makeTotalPrice = (selectItems, items) => R.pipe(
  R.keys,
  R.map(item => getPrice(selectItems[item], items)),
  R.sum
)(selectItems)

export const getPrice = (selectItem, items) => {
  const quantity = selectItem.quantity
  const item = R.find(
    R.propEq('id', parseInt(selectItem.id))
  )(items)

  if (!item) return 0

  return item.currentPrice * quantity
}

export const priceToString = price => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ'
