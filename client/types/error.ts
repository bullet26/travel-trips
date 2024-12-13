export interface HTTPError extends Error {
  info: string
  status: number
}
