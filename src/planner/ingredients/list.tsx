import React from 'react'
import { TIngredients } from './types'
import { isDesktop } from '../../constants'
import IngredientTable from './table'

type Props = {
  data: TIngredients[]
}

export default function List({data}: Props) {
  return isDesktop ? <IngredientTable data={data} /> : <div>Mobile</div>
}