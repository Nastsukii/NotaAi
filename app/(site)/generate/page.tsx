'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/motion/variants'

export default function GeneratePage() {
  const [docId, setDocId] = useState('')
  const [modelId, setModelId] = useState('default')
  const [format, setFormat] = useState<'pdf' | 'docx'>('pdf')
  const [generatedId, setGeneratedId] = useState('')
  return (
    <div className="space-y-4">
      <motion.h2 variants={fadeInUp} initial="hidden" animate="show" className="text-2xl font-semibold">Generate</motion.h2>
      <div className="space-x-2">
        <input placeholder="document id" className="border px-2 py-1" value={docId} onChange={e => setDocId(e.target.value)} />
        <input placeholder="model id" className="border px-2 py-1" value={modelId} onChange={e => setModelId(e.target.value)} />
        <select className="border px-2 py-1" value={format} onChange={e => setFormat(e.target.value as any)}>
          <option value="pdf">pdf</option>
          <option value="docx">docx</option>
        </select>
        <button className="rounded bg-black text-white px-4 py-2" onClick={() => setGeneratedId('stub-id')}>Generate</button>
      </div>
      {generatedId && <p className="text-sm text-gray-600">generated_id: {generatedId}</p>}
    </div>
  )
}
