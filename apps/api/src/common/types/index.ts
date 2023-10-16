
export type Update<T extends object, U> = U extends keyof T ? Partial<Pick<T, U>> : never;