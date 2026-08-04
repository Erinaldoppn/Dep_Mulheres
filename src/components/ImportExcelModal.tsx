import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Info,
  RefreshCw,
  Layers
} from 'lucide-react';
import { parseExcelFile, generateExcelTemplate } from '../utils/excelParser';
import { FinancialMovement } from '../types';
import { formatBRL } from '../utils/financialAnalytics';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (movements: FinancialMovement[], fileName: string) => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<{
    movements: FinancialMovement[];
    sheetName: string;
    fileName: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const result = parseExcelFile(buffer);

      setParsedPreview({
        movements: result.movements,
        sheetName: result.sheetName,
        fileName: file.name
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao processar arquivo Excel.');
      setParsedPreview(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (parsedPreview) {
      onImportSuccess(parsedPreview.movements, parsedPreview.fileName);
      onClose();
    }
  };

  const handleDownloadTemplate = () => {
    const templateBytes = generateExcelTemplate();
    const blob = new Blob([templateBytes], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Modelo_Planilha_Caixa_Mulheres_3IPI.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between bg-white/[0.04]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Importar Planilha Excel (.xlsm / .xlsx)
              </h3>
              <p className="text-xs text-slate-400">
                Aba selecionada automaticamente: <strong className="text-teal-300 font-semibold">"MOVIMENTOS"</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Instructions Banner */}
          <div className="p-4 bg-teal-950/40 rounded-xl border border-teal-500/30 text-xs text-teal-200 space-y-1.5">
            <div className="flex items-center font-bold text-white">
              <Info className="w-4 h-4 mr-1.5 text-teal-400 shrink-0" />
              Especificações da Planilha do Grupo de Mulheres:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 ml-1">
              <li>Lê arquivos <strong className="text-teal-300">.xlsm</strong> (habilitados para macro), <strong className="text-teal-300">.xlsx</strong> ou <strong>.csv</strong>.</li>
              <li>Acessa a aba denominada <span className="font-semibold text-teal-300">"MOVIMENTOS"</span>.</li>
              <li>Linhas 1 a 6 congeladas / cabeçalho; os dados iniciam a partir da <strong className="text-white">Linha 7</strong>.</li>
              <li>Colunas: <span className="font-mono text-[11px] bg-white/10 px-1.5 py-0.5 rounded text-teal-200">ID | MOVIMENTO | TIPO | DATA | MÊS | VALOR | TRANSFERÊNCIA | RESPONSÁVEL</span></li>
            </ul>
          </div>

          {/* Drag & Drop Zone */}
          {!parsedPreview && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-teal-400 bg-teal-500/20 scale-[0.99]' 
                  : 'border-white/20 hover:border-teal-400/60 bg-white/[0.03] hover:bg-white/[0.06]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xlsm,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />

              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-300 mx-auto flex items-center justify-center mb-3.5 shadow-lg">
                {isProcessing ? (
                  <RefreshCw className="w-7 h-7 animate-spin text-teal-300" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>

              <h4 className="text-sm font-bold text-white">
                {isProcessing ? 'Lendo planilha...' : 'Arraste a planilha do Excel aqui ou clique para selecionar'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Suporta .xlsm (macro), .xlsx, .xls (Tamanho máximo: 15MB)
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs text-rose-200 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Atenção:</strong> {errorMsg}
              </div>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedPreview && (
            <div className="space-y-3">
              <div className="p-3.5 bg-teal-500/20 border border-teal-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  <div>
                    <h5 className="text-xs font-bold text-white">
                      {parsedPreview.fileName}
                    </h5>
                    <p className="text-[11px] text-teal-200">
                      Aba: <strong>"{parsedPreview.sheetName}"</strong> • {parsedPreview.movements.length} lançamentos encontrados com sucesso
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setParsedPreview(null)}
                  className="text-xs text-teal-300 hover:text-teal-100 underline font-semibold cursor-pointer"
                >
                  Trocar arquivo
                </button>
              </div>

              {/* Sample 4 rows preview */}
              <div className="border border-white/10 rounded-xl overflow-hidden max-h-48 overflow-y-auto bg-white/[0.03]">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-white/[0.06] font-bold text-white sticky top-0 border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Data</th>
                      <th className="py-2.5 px-3">Movimento</th>
                      <th className="py-2.5 px-3">Tipo</th>
                      <th className="py-2.5 px-3 text-right">Valor</th>
                      <th className="py-2.5 px-3">Responsável</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {parsedPreview.movements.slice(0, 5).map((m, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.05]">
                        <td className="py-2 px-3 font-mono text-slate-400">{m.id}</td>
                        <td className="py-2 px-3 text-slate-300">{m.data}</td>
                        <td className="py-2 px-3 font-medium text-white truncate max-w-[140px]">{m.movimento}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            m.tipo === 'ENTRADA' ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}>
                            {m.tipo}
                          </span>
                        </td>
                        <td className={`py-2 px-3 text-right font-bold ${m.tipo === 'ENTRADA' ? 'text-teal-300' : 'text-rose-300'}`}>
                          {formatBRL(m.valor)}
                        </td>
                        <td className="py-2 px-3 text-slate-300 truncate max-w-[120px]">{m.responsavel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Download Official Template helper */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <span className="text-slate-400">
              Precisa do modelo padrão configurado?
            </span>
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center text-teal-300 hover:text-teal-200 font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Baixar Modelo Excel Oficial (.xlsx)
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4.5 border-t border-white/10 bg-white/[0.04] flex items-center justify-end space-x-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            disabled={!parsedPreview}
            onClick={handleConfirmImport}
            className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-40 cursor-pointer active:scale-95"
          >
            Confirmar e Atualizar Caixa
          </button>
        </div>

      </div>
    </div>
  );
};
