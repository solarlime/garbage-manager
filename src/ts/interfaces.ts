export interface Data {
  readonly id: string,
  readonly type: string,
  readonly content: string | File
}

export interface Result {
  readonly action: 'Fetch' | 'Add' | 'Delete'
  readonly status: 'OK' | 'Failure',
  readonly data: Array<Data> | Data | string
}
