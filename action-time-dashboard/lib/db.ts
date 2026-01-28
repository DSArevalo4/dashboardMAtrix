import Database from 'better-sqlite3'
import { WorkArea, Activity } from './types'
import path from 'path'

// Initialize database
const dbPath = path.join(process.cwd(), 'data', 'timetracker.db')
let db: Database.Database | null = null

export function getDatabase() {
  if (!db) {
    const fs = require('fs')
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    db = new Database(dbPath)
    initializeDatabase(db)
  }
  return db
}

function initializeDatabase(database: Database.Database) {
  // Create areas table
  database.exec(`
    CREATE TABLE IF NOT EXISTS areas (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      percentage INTEGER NOT NULL,
      color TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create activities table
  database.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      area_id TEXT NOT NULL,
      name TEXT NOT NULL,
      percentage INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE
    )
  `)

  // Create snapshots table for historical tracking
  database.exec(`
    CREATE TABLE IF NOT EXISTS snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create indexes
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_activities_area_id ON activities(area_id)
  `)
}

// Area operations
export function saveAreas(areas: WorkArea[]) {
  const db = getDatabase()
  
  const transaction = db.transaction(() => {
    // Clear existing data
    db.prepare('DELETE FROM activities').run()
    db.prepare('DELETE FROM areas').run()
    
    // Insert areas
    const insertArea = db.prepare(`
      INSERT INTO areas (id, name, percentage, color, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)
    
    const insertActivity = db.prepare(`
      INSERT INTO activities (id, area_id, name, percentage, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)
    
    for (const area of areas) {
      insertArea.run(area.id, area.name, area.percentage, area.color)
      
      for (const activity of area.activities) {
        insertActivity.run(activity.id, area.id, activity.name, activity.percentage)
      }
    }
  })
  
  transaction()
}

export function loadAreas(): WorkArea[] {
  const db = getDatabase()
  
  const areas = db.prepare('SELECT * FROM areas ORDER BY id').all() as Array<{
    id: string
    name: string
    percentage: number
    color: string
  }>
  
  const activities = db.prepare('SELECT * FROM activities ORDER BY area_id, id').all() as Array<{
    id: string
    area_id: string
    name: string
    percentage: number
  }>
  
  return areas.map(area => ({
    ...area,
    activities: activities
      .filter(activity => activity.area_id === area.id)
      .map(activity => ({
        id: activity.id,
        name: activity.name,
        percentage: activity.percentage
      }))
  }))
}

// Snapshot operations
export function saveSnapshot(name: string, areas: WorkArea[]) {
  const db = getDatabase()
  
  const insert = db.prepare(`
    INSERT INTO snapshots (name, data)
    VALUES (?, ?)
  `)
  
  insert.run(name, JSON.stringify(areas))
}

export function loadSnapshots() {
  const db = getDatabase()
  
  return db.prepare(`
    SELECT id, name, created_at
    FROM snapshots
    ORDER BY created_at DESC
  `).all()
}

export function loadSnapshotById(id: number): WorkArea[] {
  const db = getDatabase()
  
  const snapshot = db.prepare('SELECT data FROM snapshots WHERE id = ?').get(id) as { data: string } | undefined
  
  if (!snapshot) {
    throw new Error('Snapshot not found')
  }
  
  return JSON.parse(snapshot.data)
}

export function deleteSnapshot(id: number) {
  const db = getDatabase()
  
  db.prepare('DELETE FROM snapshots WHERE id = ?').run(id)
}

// Close database connection
export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}
