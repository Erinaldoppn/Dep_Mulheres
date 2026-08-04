import React, { useState, useEffect } from 'react';
import { X, Save, PlusCircle, Check } from 'lucide-react';
import { FinancialMovement, MovementType } from '../types';
import { MONTH_LIST } from '../utils/financialAnalytics';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movement: FinancialMovement) => void;
  initialData?: FinancialMovement | null;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<FinancialMovement>>({
    movimento: '',
    tipo: 'ENTRADA',
    data: new Date().toISOString().split('T')[0],
    mes: 'Agosto',
    valor: 0,
    transferencia: 'PIX',
    responsavel: 'Maria Clara (Tesouraria)',
    observacao: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        movimento: '',
        tipo: 'ENTRADA',
        data: new Date().toISOString().split('T')[0],
        mes: 'Agosto',
        valor: 0,
        transferencia: 'PIX',
        responsavel: 'Maria Clara (Tesouraria)',
        observacao: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.movimento || !formData.valor) return;

    const newMov: FinancialMovement = {
      id: initialData?.id || `MOV-${Date.now()}`,
      movimento: formData.movimento || 'Lançamento',
      tipo: formData.tipo as MovementType || 'ENTRADA',
      data: formData.data || new Date().toISOString().split('T')[0],
      mes: formData.mes || 'Agosto',
      valor: Number(formData.valor) || 0,
      transferencia: formData.transferencia || 'PIX',
      responsavel: formData.responsavel || 'Tesouraria',
      observacao: formData.observacao || ''
    };

    onSave(newMov);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between bg-white/[0.04]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {initialData ? 'Editar Lançamento' : 'Novo Lançamento no Caixa'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Tipo: ENTRADA / SAÍDA */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tipo: 'ENTRADA' })}
                className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  formData.tipo === 'ENTRADA'
                    ? 'bg-teal-500/30 text-teal-300 border-teal-500/40 shadow-xs'
                    : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                + ENTRADA (Receita)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tipo: 'SAIDA' })}
                className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  formData.tipo === 'SAIDA'
                    ? 'bg-rose-500/30 text-rose-300 border-rose-500/40 shadow-xs'
                    : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                - SAÍDA (Despesa)
              </button>
            </div>
          </div>

          {/* Movimento / Descrição */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
              Movimento / Descrição <span className="text-teal-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Chá das Mulheres - Ingressos, Ornamentação..."
              value={formData.movimento || ''}
              onChange={(e) => setFormData({ ...formData, movimento: e.target.value })}
              className="w-full px-3 py-2 glass-input rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          {/* Valor and Data */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Valor (R$) <span className="text-teal-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                min="0.01"
                placeholder="0.00"
                value={formData.valor || ''}
                onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 glass-input rounded-xl text-xs text-teal-300 font-bold placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Data
              </label>
              <input
                type="date"
                value={formData.data || ''}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="w-full px-3 py-2 glass-input rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
          </div>

          {/* Mês and Transferência */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Mês
              </label>
              <select
                value={formData.mes || 'Agosto'}
                onChange={(e) => setFormData({ ...formData, mes: e.target.value })}
                className="w-full px-3 py-2 glass-input rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
              >
                {MONTH_LIST.map(m => (
                  <option key={m} value={m} className="bg-slate-900 text-white">{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Transferência / Pgto
              </label>
              <select
                value={formData.transferencia || 'PIX'}
                onChange={(e) => setFormData({ ...formData, transferencia: e.target.value })}
                className="w-full px-3 py-2 glass-input rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
              >
                <option value="PIX" className="bg-slate-900 text-white">PIX</option>
                <option value="Dinheiro (Espécie)" className="bg-slate-900 text-white">Dinheiro (Espécie)</option>
                <option value="Transferência Bancária" className="bg-slate-900 text-white">Transferência Bancária</option>
                <option value="Cartão Débito" className="bg-slate-900 text-white">Cartão Débito</option>
                <option value="Cartão Crédito" className="bg-slate-900 text-white">Cartão Crédito</option>
              </select>
            </div>
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
              Responsável
            </label>
            <input
              type="text"
              placeholder="Ex: Maria Clara (Tesouraria), Ana Paula..."
              value={formData.responsavel || ''}
              onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
              className="w-full px-3 py-2 glass-input rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          {/* Observação */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
              Observação / Detalhes (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Pagamento 1ª parcela, comprovante anexado..."
              value={formData.observacao || ''}
              onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
              className="w-full px-3 py-2 glass-input rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5 mr-1.5 stroke-[2.5]" />
              Salvar Lançamento
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
