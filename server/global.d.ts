

declare namespace NodeJS {
  export interface Global {
    MySQL: any
  }
}

type RoleName = 'salespeople' | 'quoter' | 'salesleader'