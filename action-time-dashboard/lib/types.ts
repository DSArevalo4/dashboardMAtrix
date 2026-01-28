export interface Activity {
  id: string
  name: string
  percentage: number
}

export interface WorkArea {
  id: string
  name: string
  percentage: number
  color: string
  activities: Activity[]
}

export type AreaId = 'cic' | 'admin' | 'soporte' | 'implementacion'
