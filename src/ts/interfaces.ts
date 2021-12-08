export interface Data {
  readonly id: string,
  readonly content: string | Blob
}

export interface Result {
  readonly action: 'Fetch' | 'Add' | 'Delete'
  readonly status: 'OK' | 'Failure',
  readonly data: Data
}
