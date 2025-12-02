'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Upload, FileText, CheckCircle, Clock, DollarSign, Users, BookOpen, Search, AlertCircle, FileCheck, Loader2, X, Copy, Check, File, Trash2, Plus, PenTool, LayoutTemplate } from 'lucide-react'

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>{children}</div>
)

const Badge = ({ children, color = "blue" }: { children: React.ReactNode; color?: string }) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
    red: "bg-red-100 text-red-700"
  }
  return <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[color] || colors.blue}`}>{children}</span>
}

const fileToBase64 = (file: File) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    const base64String = String(reader.result).split(',')[1]
    resolve({ mimeType: file.type, data: base64String })
  }
  reader.onerror = (err) => reject(err)
})

const callGeminiAPI = async (files: File[]) => {
  const processed = await Promise.all(files.map(fileToBase64))
  const prompt = `
    Analise os arquivos fornecidos (que podem ser múltiplas páginas de um mesmo documento ou documentos relacionados de um registro de imóvel).
    Consolide as informações de TODAS as páginas/arquivos e retorne EXATAMENTE e APENAS um JSON válido com a seguinte estrutura (sem markdown, sem \`\`\`json):
    {"metadata":{"tipo":"Tipo do documento principal","cartorio":"Nome do cartório/tabelionato"},"registro":{"livro":"Número do livro","folhas":"Número das folhas","dataLavratura":"Data do documento","matricula":"Número da matrícula"},"transacao":{"valor":"Valor numérico total (ex: R$ 500.000,00)","valorExtenso":"Valor por extenso","formaPagamento":"Resumo da forma de pagamento","dataVenda":"Data da venda"},"partes":{"vendedores":[{"nome":"Nome completo","qualificacao":"Dados completos (CPF, RG, Profissão, Estado Civil)"}],"compradores":[{"nome":"Nome completo","qualificacao":"Dados completos"}],"representantes":[{"nome":"Nome","tipo":"Procurador/Representante","qualificacao":"Dados","documentoProcuracao":"Dados da procuração"}]},"resumoTexto":"Crie um texto corrido, formal e bem formatado contendo um resumo completo de todos os dados extraídos, unificando as informações encontradas nas diferentes páginas."}`
  const res = await fetch('/api/ai', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, files: processed })
  })
  if (!res.ok) throw new Error('AI error')
  return await res.json()
}

export default function App() {
  const [activeTab, setActiveTab] = useState('analysis')
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [genData, setGenData] = useState({
    dataLavratura: "",
    livro: "",
    cidadeCartorio: "",
    tipoVendedor: "os proprietários",
    vendedores: "",
    valor: "",
    dataVenda: "",
    compradores: ""
  })
  const [generatedText, setGeneratedText] = useState("")
  const [genCopied, setGenCopied] = useState(false)

  useEffect(() => {
    let artigo = "os"
    let sujeito = "proprietários"
    switch(genData.tipoVendedor) {
      case "o proprietário": artigo = "o"; sujeito = "proprietário"; break
      case "a proprietária": artigo = "a"; sujeito = "proprietária"; break
      case "os proprietários": artigo = "os"; sujeito = "proprietários"; break
      case "as proprietárias": artigo = "as"; sujeito = "proprietárias"; break
      default: artigo = "os"; sujeito = "proprietários"
    }
    const texto = `Conforme escritura publica de compra e venda, lavrada aos ${genData.dataLavratura || "[DATA DA LAVRATURA]"}, no livro ${genData.livro || "[LIVRO]"}, no serviço notarial de ${genData.cidadeCartorio || "[CIDADE]"}, procedo esta averbação para contar que ${artigo} ${sujeito} ${genData.vendedores || "[NOME DOS VENDEDORES]"}, venderam o imóvel da presente matricula pelo valor de ${genData.valor || "[VALOR]"}, aos ${genData.dataVenda || "[DATA DA VENDA]"}, para os outorgantes compradores ${genData.compradores || "[QUALIFICAÇÃO COMPRADORES]"}.`
    setGeneratedText(texto)
  }, [genData])

  const handleGenChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGenData(prev => ({ ...prev, [name]: value }))
  }

  const copyGeneratedText = () => { navigator.clipboard.writeText(generatedText); setGenCopied(true); setTimeout(() => setGenCopied(false), 2000) }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => { setIsDragging(false) }
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); addFiles(Array.from(e.dataTransfer.files)) }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files.length > 0) addFiles(Array.from(e.target.files)) }
  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => file.type.includes('image') || file.type === 'application/pdf')
    if (validFiles.length !== newFiles.length) alert("Apenas imagens e PDFs são permitidos.")
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
      if (status === 'complete' || status === 'error') { setStatus('idle'); setResult(null) }
    }
  }
  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx))
  const startProcessing = async () => {
    if (files.length === 0) return
    setStatus('processing'); setResult(null); setErrorMessage("")
    try {
      const data = await callGeminiAPI(files)
      const payload = data?.output || data
      setResult(payload)
      setStatus('complete')
      if (payload) {
        setGenData({
          dataLavratura: payload.registro?.dataLavratura || "",
          livro: payload.registro?.livro || "",
          cidadeCartorio: payload.metadata?.cartorio?.split(" - ")[0] || "",
          tipoVendedor: "os proprietários",
          vendedores: payload.partes?.vendedores?.map((v: any) => v.nome).join(", ") || "",
          valor: payload.transacao?.valor || "",
          dataVenda: payload.transacao?.dataVenda || "",
          compradores: payload.partes?.compradores?.map((c: any) => `${c.nome} (${c.qualificacao})`).join(", ") || ""
        })
      }
    } catch (error) {
      setErrorMessage("Erro ao analisar. Tente novamente.")
      setStatus('error')
    }
  }
  const copyToClipboard = () => { if (result?.resumoTexto) { navigator.clipboard.writeText(result.resumoTexto); setCopied(true); setTimeout(() => setCopied(false), 2000) } }
  const resetApp = () => { setFiles([]); setStatus('idle'); setResult(null); setErrorMessage("") }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-8 h-8 text-blue-600" />
              ImóvelScan Multi <Badge color="green">ONLINE</Badge>
            </h1>
            <p className="text-slate-500 mt-1">Análise inteligente e geração de documentos.</p>
          </div>
          <div className="flex p-1 bg-slate-200 rounded-lg">
            <button onClick={() => setActiveTab('analysis')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
              <Search className="w-4 h-4" /> Análise IA
            </button>
            <button onClick={() => setActiveTab('generator')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'generator' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
              <PenTool className="w-4 h-4" /> Gerador de Texto
            </button>
          </div>
        </header>

        {activeTab === 'analysis' && (
          <main className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-700">Leitura de Documentos</h2>
              {status === 'complete' && (
                <button onClick={resetApp} className="text-sm text-slate-500 hover:text-red-600 flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Limpar Análise
                </button>
              )}
            </div>
            {status !== 'processing' && status !== 'complete' && (
              <div className="space-y-4">
                <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-slate-300 hover:border-slate-400 bg-white'}`}>
                  <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/png, image/jpeg, image/jpg, application/pdf" />
                  <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                    <div className={`p-3 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-slate-100'}`}>
                      <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slate-900">Arraste arquivos aqui</p>
                      <p className="text-slate-500 text-sm">PDF, JPG e PNG</p>
                    </div>
                  </div>
                </div>
                {files.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-white p-2 rounded border border-slate-200 text-slate-500">
                              {file.type.includes('pdf') ? <FileText className="w-5 h-5" /> : <File className="w-5 h-5" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                              <p className="text-xs text-slate-400">{(file.size/1024/1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); removeFile(idx) }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button onClick={startProcessing} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm flex items-center gap-2">
                        Processar {files.length} Arquivo(s)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {status === 'processing' && (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-slate-800">Processando...</h2>
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{errorMessage}</p>
                <button onClick={startProcessing} className="text-red-700 font-medium underline">Tentar novamente</button>
              </div>
            )}
            {status === 'complete' && result && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
                <div className="md:col-span-3">
                  <Card className="p-6 border border-blue-200 bg-blue-50/30">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-blue-800 uppercase flex items-center gap-2"><FileText className="w-4 h-4" /> Resumo IA</h3>
                      <button onClick={copyToClipboard} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'}`}>
                        {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar</>}
                      </button>
                    </div>
                    <textarea readOnly value={result.resumoTexto || ""} className="w-full h-40 p-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none resize-none" />
                  </Card>
                </div>
                <div className="md:col-span-1 space-y-4">
                  <Card className="p-4 border-l-4 border-blue-500">
                    <p className="text-xs text-slate-500">Cartório</p>
                    <p className="font-medium">{result.metadata?.cartorio || "-"}</p>
                  </Card>
                  <Card className="p-4 border-l-4 border-green-500">
                    <p className="text-xs text-slate-500">Valor</p>
                    <p className="font-bold text-green-700 text-lg">{result.transacao?.valor || "-"}</p>
                  </Card>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <Card className="p-4">
                    <h4 className="font-semibold text-sm mb-2 text-slate-700">Vendedores</h4>
                    {result.partes?.vendedores?.map((v: any, i: number) => <div key={i} className="text-sm p-2 bg-slate-50 rounded mb-1">{v.nome}</div>) || <span className="text-slate-400 text-sm">Não identificado</span>}
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold text-sm mb-2 text-slate-700">Compradores</h4>
                    {result.partes?.compradores?.map((c: any, i: number) => <div key={i} className="text-sm p-2 bg-slate-50 rounded mb-1">{c.nome}</div>) || <span className="text-slate-400 text-sm">Não identificado</span>}
                  </Card>
                </div>
              </div>
            )}
          </main>
        )}

        {activeTab === 'generator' && (
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-blue-600" />
                  Dados para Averbação
                </h2>
                <p className="text-slate-500 text-sm mt-1">Preencha os campos abaixo para gerar o texto automaticamente.</p>
              </div>
              <Card className="p-6 space-y-4 shadow-md border-blue-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Data da Lavratura</label>
                    <input type="text" name="dataLavratura" placeholder="Ex: 15 de janeiro de 2024" value={genData.dataLavratura} onChange={handleGenChange} className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Data da Venda</label>
                    <input type="text" name="dataVenda" placeholder="Ex: 10 de janeiro de 2024" value={genData.dataVenda} onChange={handleGenChange} className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Livro da Escritura</label>
                    <input type="text" name="livro" placeholder="Ex: 3.456" value={genData.livro} onChange={handleGenChange} className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Cidade do Tabelionato</label>
                    <input type="text" name="cidadeCartorio" placeholder="Ex: São Paulo" value={genData.cidadeCartorio} onChange={handleGenChange} className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Qualificação dos Vendedores</label>
                  <div className="flex gap-2 mb-2">
                    <select name="tipoVendedor" value={genData.tipoVendedor} onChange={handleGenChange} className="p-2 border border-slate-300 rounded-md text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="o proprietário">O proprietário</option>
                      <option value="a proprietária">A proprietária</option>
                      <option value="os proprietários">Os proprietários</option>
                      <option value="as proprietárias">As proprietárias</option>
                    </select>
                    <input type="text" name="vendedores" placeholder="Nomes dos vendedores..." value={genData.vendedores} onChange={handleGenChange} className="flex-1 p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Valor do Imóvel</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 text-sm">R$</span>
                    <input type="text" name="valor" placeholder="0,00" value={genData.valor} onChange={handleGenChange} className="w-full pl-8 p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Compradores (Nome e Qualificação)</label>
                  <textarea name="compradores" placeholder="Ex: João da Silva, brasileiro, casado, empresário..." value={genData.compradores} onChange={handleGenChange} rows={3} className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                </div>
              </Card>
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Texto Gerado
                </h2>
                <p className="text-slate-500 text-sm mt-1">Copie o texto abaixo para utilizar no registro.</p>
              </div>
              <div className="sticky top-6">
                <Card className="p-0 border-green-200 shadow-lg bg-white overflow-hidden flex flex-col h-[500px]">
                  <div className="bg-green-50 p-4 border-b border-green-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Visualização em Tempo Real</span>
                    <button onClick={copyGeneratedText} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${genCopied ? 'bg-green-600 text-white' : 'bg-white text-green-700 hover:bg-green-100'}`}>
                      {genCopied ? <><Check className="w-3 h-3" /> COPIADO</> : <><Copy className="w-3 h-3" /> COPIAR TEXTO</>}
                    </button>
                  </div>
                  <div className="flex-1 p-6 bg-slate-50/50 overflow-y-auto">
                    <p className="text-slate-800 leading-loose text-lg font-serif whitespace-pre-wrap">{generatedText}</p>
                  </div>
                  <div className="p-3 bg-slate-100 border-t border-slate-200 text-center">
                    <p className="text-xs text-slate-400">Modelo: Averbação de Venda</p>
                  </div>
                </Card>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  )
}
