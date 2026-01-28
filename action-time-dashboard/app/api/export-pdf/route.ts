import { NextRequest, NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import { WorkArea } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { areas } = await request.json() as { areas: WorkArea[] }
    
    if (!areas || !Array.isArray(areas)) {
      return NextResponse.json({ error: 'Invalid areas data' }, { status: 400 })
    }

    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20

    // Header
    pdf.setFontSize(20)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Reporte de Gestión de Tiempo', pageWidth / 2, yPosition, { align: 'center' })
    
    yPosition += 10
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15

    // Summary section
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Resumen General', 14, yPosition)
    
    yPosition += 8
    
    const totalPercentage = areas.reduce((sum, a) => sum + a.percentage, 0)
    
    pdf.setFontSize(10)
    pdf.text(`Total asignado: ${totalPercentage}%`, 14, yPosition)
    
    yPosition += 10

    // Draw pie chart representation using colored rectangles
    pdf.setFontSize(12)
    pdf.text('Distribución por Áreas', 14, yPosition)
    yPosition += 8

    areas.forEach((area) => {
      const color = hexToRgb(area.color)
      pdf.setFillColor(color.r, color.g, color.b)
      pdf.rect(14, yPosition - 3, 5, 5, 'F')
      
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`${area.name}: ${area.percentage}%`, 22, yPosition)
      
      yPosition += 7
    })

    yPosition += 10

    // Matrix table
    pdf.setFontSize(14)
    pdf.text('Matriz de Distribución Detallada', 14, yPosition)
    yPosition += 10

    // Table headers
    pdf.setFillColor(240, 240, 240)
    pdf.rect(14, yPosition - 5, pageWidth - 28, 8, 'F')
    
    pdf.setFontSize(9)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Área', 16, yPosition)
    pdf.text('% Área', 70, yPosition)
    pdf.text('Actividad', 95, yPosition)
    pdf.text('% Act.', 155, yPosition)
    pdf.text('% Real', 180, yPosition)
    
    yPosition += 8

    // Table content
    pdf.setFontSize(8)
    
    areas.forEach((area) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = 20
        
        // Re-draw headers on new page
        pdf.setFillColor(240, 240, 240)
        pdf.rect(14, yPosition - 5, pageWidth - 28, 8, 'F')
        pdf.setFontSize(9)
        pdf.text('Área', 16, yPosition)
        pdf.text('% Área', 70, yPosition)
        pdf.text('Actividad', 95, yPosition)
        pdf.text('% Act.', 155, yPosition)
        pdf.text('% Real', 180, yPosition)
        yPosition += 8
        pdf.setFontSize(8)
      }

      if (area.activities.length > 0) {
        area.activities.forEach((activity, index) => {
          const realPercentage = ((area.percentage * activity.percentage) / 100).toFixed(1)
          
          // Draw colored indicator for area
          if (index === 0) {
            const color = hexToRgb(area.color)
            pdf.setFillColor(color.r, color.g, color.b)
            pdf.circle(17, yPosition - 1.5, 1.5, 'F')
          }
          
          pdf.setTextColor(0, 0, 0)
          
          if (index === 0) {
            pdf.text(area.name, 22, yPosition)
            pdf.text(`${area.percentage}%`, 72, yPosition)
          }
          
          pdf.text(activity.name.substring(0, 30), 95, yPosition)
          pdf.text(`${activity.percentage}%`, 157, yPosition)
          pdf.text(`${realPercentage}%`, 182, yPosition)
          
          // Draw separator line
          pdf.setDrawColor(220, 220, 220)
          pdf.line(14, yPosition + 2, pageWidth - 14, yPosition + 2)
          
          yPosition += 6
        })
      } else {
        const color = hexToRgb(area.color)
        pdf.setFillColor(color.r, color.g, color.b)
        pdf.circle(17, yPosition - 1.5, 1.5, 'F')
        
        pdf.setTextColor(0, 0, 0)
        pdf.text(area.name, 22, yPosition)
        pdf.text(`${area.percentage}%`, 72, yPosition)
        pdf.setTextColor(150, 150, 150)
        pdf.text('Sin actividades', 95, yPosition)
        
        pdf.setDrawColor(220, 220, 220)
        pdf.line(14, yPosition + 2, pageWidth - 14, yPosition + 2)
        
        yPosition += 6
      }
    })

    // Summary boxes at the end
    yPosition += 10
    
    if (yPosition > pageHeight - 40) {
      pdf.addPage()
      yPosition = 20
    }

    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Resumen de Tiempo Real por Área', 14, yPosition)
    yPosition += 10

    areas.forEach((area, index) => {
      const realTotal = area.activities.reduce(
        (sum, act) => sum + (area.percentage * act.percentage) / 100,
        0
      )
      
      const xPosition = 14 + (index % 2) * 90
      if (index > 0 && index % 2 === 0) {
        yPosition += 20
      }

      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = 20
      }

      const color = hexToRgb(area.color)
      pdf.setFillColor(color.r, color.g, color.b, 0.1)
      pdf.roundedRect(xPosition, yPosition - 8, 80, 15, 2, 2, 'F')
      
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 100)
      pdf.text(area.name, xPosition + 40, yPosition - 2, { align: 'center' })
      
      pdf.setFontSize(16)
      pdf.setTextColor(color.r, color.g, color.b)
      const displayValue = area.activities.length > 0 
        ? `${realTotal.toFixed(1)}%` 
        : `${area.percentage}%`
      pdf.text(displayValue, xPosition + 40, yPosition + 5, { align: 'center' })
    })

    // Footer
    const totalPages = pdf.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text(
        `Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reporte-tiempo-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}
