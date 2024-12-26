export type IDParams = { id: string }

export type IDParamsFull = {
  params: Promise<IDParams>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
