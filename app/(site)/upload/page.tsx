'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/motion/variants'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  return (
    <div className="space-y-4">
      <motion.h2 variants={fadeInUp} initial="hidden" animate="show" className="text-2xl font-semibold">Upload</motion.h2>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button className="rounded bg-black text-white px-4 py-2" onClick={() => setStatus(file ? 'Uploaded (stub)' : 'Select a file')}>Send</button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  )
}
