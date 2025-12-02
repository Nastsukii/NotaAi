import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const prompt = String(body?.prompt || '')
  const files = Array.isArray(body?.files) ? body.files : []
  if (!prompt) return new Response(JSON.stringify({ error: 'Missing prompt' }), { status: 400 })
  const provider = process.env.AI_PROVIDER || 'openai'
  const openaiKey = process.env.OPENAI_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY
  if (provider === 'openai' && !openaiKey) return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500 })
  if (provider === 'gemini' && !geminiKey) return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), { status: 500 })

  const parts: any[] = [{ type: 'text', text: prompt }]
  for (const f of files) {
    if (f?.mimeType?.startsWith('image/')) {
      parts.push({ type: 'input_image', image_url: { url: `data:${f.mimeType};base64,${f.data}` } })
    } else {
      parts.push({ type: 'text', text: `Arquivo ${f?.mimeType || 'desconhecido'} anexado.` })
    }
  }

  try {
    console.log('[AI DEBUG] Request start', { provider, prompt_len: prompt.length, files_count: files.length })
    if (provider === 'gemini') {
      const contents = [
        {
          role: 'user',
          parts: [
            { text: prompt },
            ...files.map((f: any) => ({ inlineData: { mimeType: f.mimeType, data: f.data } }))
          ]
        }
      ]
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { responseMimeType: 'application/json' } })
      })
      if (!res.ok) {
        const errText = await res.text()
        console.error('[AI ERROR] Gemini response not OK', { status: res.status, statusText: res.statusText, body: errText })
        return new Response(JSON.stringify({ error: 'Gemini error', status: res.status, details: errText }), { status: 500 })
      }
      const json = await res.json()
      let textResponse = json?.candidates?.[0]?.content?.parts?.[0]?.text
      
      // Clean up markdown code blocks if present
      if (textResponse && typeof textResponse === 'string') {
        textResponse = textResponse.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      const output = textResponse ? JSON.parse(textResponse) : json
      console.log('[AI DEBUG] Gemini success', { has_output: Boolean(output) })
      return new Response(JSON.stringify({ output }), { status: 200 })
    } else {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'user', content: parts.map((p: any) => (
              p.type === 'input_image'
                ? { type: 'image_url', image_url: p.image_url }
                : { type: 'text', text: p.text }
            )) }
          ],
          response_format: { type: 'json_object' }
        })
      })
      if (!res.ok) {
        const errText = await res.text()
        console.error('[AI ERROR] OpenAI response not OK', { status: res.status, statusText: res.statusText, body: errText })
        return new Response(JSON.stringify({ error: 'OpenAI error', status: res.status, details: errText }), { status: 500 })
      }
      const json = await res.json()
      let content = json?.choices?.[0]?.message?.content
      
      if (typeof content === 'string') {
        content = content.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      const output = typeof content === 'string' ? JSON.parse(content) : content || json
      console.log('[AI DEBUG] OpenAI success', { has_output: Boolean(output) })
      return new Response(JSON.stringify({ output }), { status: 200 })
    }
  } catch (e: any) {
    console.error('[AI ERROR] Exception thrown', { message: e?.message, stack: e?.stack })
    return new Response(JSON.stringify({ error: e?.message || 'AI request failed' }), { status: 500 })
  }
}
