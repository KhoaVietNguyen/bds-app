import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  const folder = (formData.get('folder') as string) || 'bds-app'

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve(result as { secure_url: string; public_id: string })
      }
    ).end(buffer)
  })

  return NextResponse.json({ url: result.secure_url, publicId: result.public_id })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { publicId } = await request.json()
  if (!publicId) return NextResponse.json({ error: 'No publicId' }, { status: 400 })

  await cloudinary.uploader.destroy(publicId)
  return NextResponse.json({ ok: true })
}
