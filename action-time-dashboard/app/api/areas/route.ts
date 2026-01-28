import { NextRequest, NextResponse } from 'next/server'
import { loadAreas, saveAreas } from '@/lib/db'
import { WorkArea } from '@/lib/types'

export async function GET() {
  try {
    const areas = loadAreas()
    return NextResponse.json({ areas })
  } catch (error) {
    console.error('Error loading areas:', error)
    return NextResponse.json({ error: 'Failed to load areas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { areas } = await request.json() as { areas: WorkArea[] }
    
    if (!areas || !Array.isArray(areas)) {
      return NextResponse.json({ error: 'Invalid areas data' }, { status: 400 })
    }
    
    saveAreas(areas)
    
    return NextResponse.json({ success: true, message: 'Areas saved successfully' })
  } catch (error) {
    console.error('Error saving areas:', error)
    return NextResponse.json({ error: 'Failed to save areas' }, { status: 500 })
  }
}
