import { NextRequest, NextResponse } from 'next/server'
import { saveSnapshot, loadSnapshots, loadSnapshotById, deleteSnapshot } from '@/lib/db'
import { WorkArea } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (id) {
      const snapshot = loadSnapshotById(parseInt(id))
      return NextResponse.json({ snapshot })
    }
    
    const snapshots = loadSnapshots()
    return NextResponse.json({ snapshots })
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
    
    saveSnapshot(name, areas)
    
    return NextResponse.json({ success: true, message: 'Snapshot saved successfully' })
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
    
    deleteSnapshot(parseInt(id))
    
    return NextResponse.json({ success: true, message: 'Snapshot deleted successfully' })
  } catch (error) {
    console.error('Error deleting snapshot:', error)
    return NextResponse.json({ error: 'Failed to delete snapshot' }, { status: 500 })
  }
}
