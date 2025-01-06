export type SearchType = 'place' | 'city' | 'country'

interface SearchNestItem {
  id: number
  name: string
  type: SearchType
}

export type SearchNestResult = SearchNestItem[]
