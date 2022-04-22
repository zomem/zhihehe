import {Decimal} from 'decimal.js'


// 生成商品定价 
export const salePrice = (cost:number=0, fscost:number=0, scost:number=0, percent:number): number => {
  let all = new Decimal(cost).add(new Decimal(scost)).add(new Decimal(fscost))
  return new Decimal(percent).mul(all).toNumber()
}