import { NextRequest, NextResponse } from 'next/server'
import { WorkArea, Snapshot } from '@/lib/types'

// LocalStorage-based snapshot management
// These functions work with browser localStorage, no SQLite required

const SNAPSHOTS_KEY = 'timetracker-snapshots'

function getSnapshots(): Snapshot[] {
  if (typeof window === 'undefined') {
    return []
  }
  try {
    const stored = localStorage.getItem(SNAPSHOTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveSnapshotsToStorage(snapshots: Snapshot[]) {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots))
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    // This endpoint returns mock data that will be handled by client-side localStorage
    // Client should use localStorage directly instead of API
    
    return NextResponse.json({ 
      message: 'Use client-side localStorage for snapshots',
      useLocalStorage: true 
    })
  } catch (error) {
    console.error('Error loading snapshots:', error)
    return NextResponse.json({ error: 'Failed to load snapshots' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, areas } = await request.json() as { name: string; areas: WorkArea[] }
    
    if (!name || !areas || !Array.isArray(areas)) {
      return NextResponse.json({ error: 'Invalid snapshot data' }, { status: 400 })
    }
    
    // Return success, client will handle localStorage
    return NextResponse.json({ 
      success: true, 
      message: 'Use client-side localStorage for snapshots',
      useLocalStorage: true 
    })
  } catch (error) {
    console.error('Error saving snapshot:', error)
    return NextResponse.json({ error: 'Failed to save snapshot' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Snapshot ID required' }, { status: 400 })
    }
    
    // Return success, client will handle localStorage
    return NextResponse.json({ 
      success: true, 
      message: 'Use client-side localStorage for snapshots',
      useLocalStorage: true 
    })
  } catch (error) {
    console.error('Error deleting snapshot:', error)
    return NextResponse.json({ error: 'Failed to delete snapshot' }, { status: 500 })
  }
}
