'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/motion/variants'

export default function ReviewPage() {
  const [docId, setDocId] = useState('')
  const [edits, setEdits] = useState<{ field: string; value: string }[]>([])
  const [field, setField] = useState('')
  const [value, setValue] = useState('')
  return (
    <div className="space-y-4">
      <motion.h2 variants={fadeInUp} initial="hidden" animate="show" className="text-2xl font-semibold">Review</motion.h2>
      <div className="space-x-2">
        <input placeholder="document id" className="border px-2 py-1" value={docId} onChange={e => setDocId(e.target.value)} />
        <button className="rounded bg-black text-white px-4 py-2">Load</button>
      </div>
      <div className="space-x-2">
        <input placeholder="field" className="border px-2 py-1" value={field} onChange={e => setField(e.target.value)} />
        <input placeholder="value" className="border px-2 py-1" value={value} onChange={e => setValue(e.target.value)} />
        <button className="rounded bg-black text-white px-4 py-2" onClick={() => {
          if (!field) return; setEdits([...edits, { field, value }]); setField(''); setValue('')
        }}>Add</button>
      </div>
      <ul className="list-disc ml-5">
        {edits.map((e, i) => (<li key={i}>{e.field} → {e.value}</li>))}
      </ul>
      <button className="rounded bg-black text-white px-4 py-2">Confirm & Save</button>
    </div>
  )
}
