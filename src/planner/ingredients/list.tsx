import { TIngredients } from './types'
import { isDesktop } from '../../constants'
import IngredientTable from './table'
import IngredientCards from './cards'

type Props = {
  data: TIngredients[]
}

export default function List({data}: Props) {
  return isDesktop ? <IngredientTable data={data} /> : <IngredientCards data={data} />
}