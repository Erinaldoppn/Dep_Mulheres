import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FinancialMovement, FinancialKPIs, MonthSummary } from '../types';
import { formatBRL, calculateCategoryBreakdown } from './financialAnalytics';

export interface PDFExportOptions {
  movements: FinancialMovement[];
  kpis: FinancialKPIs;
  selectedMonth: string;
  monthlySummaries: MonthSummary[];
  fileName?: string;
}

export function generateFinancialPDF(options: PDFExportOptions): void {
  const { movements, kpis, selectedMonth, monthlySummaries } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const emeraldColor: [number, number, number] = [16, 185, 129]; // Emerald 500
  const roseColor: [number, number, number] = [244, 63, 94]; // Rose 500
  const indigoColor: [number, number, number] = [79, 70, 229]; // Indigo 600

  // 1. Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('3ª IGREJA PRESBITERIANA INDEPENDENTE DE NATAL - RN', 14, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTÉRIO DE MULHERES / SOCIEDADE AUXILIADORA FEMININA (SAF)', 14, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(226, 232, 240);
  doc.text(`RELATÓRIO FINANCEIRO CONSOLIDADO - ${selectedMonth === 'TODOS' ? 'CONSOLIDADO ANUAL' : `MÊS DE ${selectedMonth.toUpperCase()}`}`, 14, 28);

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Emissão: ${dateStr}`, 145, 33);

  // 2. Summary KPI Cards
  let yPos = 46;

  // Draw 4 Metric Cards
  const cardW = 43;
  const cardH = 22;
  const cardY = yPos;

  // Card 1: Entradas
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, cardY, cardW, cardH, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('TOTAL ENTRADAS', 18, cardY + 6);
  doc.setFontSize(11);
  doc.text(formatBRL(kpis.totalEntradas), 18, cardY + 14);

  // Card 2: Saídas
  doc.setFillColor(255, 241, 242);
  doc.setDrawColor(254, 205, 211);
  doc.roundedRect(61, cardY, cardW, cardH, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(159, 18, 57);
  doc.text('TOTAL SAÍDAS', 65, cardY + 6);
  doc.setFontSize(11);
  doc.text(formatBRL(kpis.totalSaidas), 65, cardY + 14);

  // Card 3: Saldo Período
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(108, cardY, cardW, cardH, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 48, 163);
  doc.text('SALDO DO PERÍODO', 112, cardY + 6);
  doc.setFontSize(11);
  doc.text(formatBRL(kpis.saldoPeriodo), 112, cardY + 14);

  // Card 4: Projeção Próximo Mês
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(155, cardY, cardW, cardH, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('PROJEÇÃO PRÓX. MÊS', 159, cardY + 6);
  doc.setFontSize(11);
  doc.text(formatBRL(kpis.projecaoProximoMes.saldoEstimado), 159, cardY + 14);

  yPos = 74;

  // 3. Overview Highlights
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Resumo Orçamentário e Saldo Acumulado', 14, yPos);

  yPos += 5;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const infoLine1 = `• Saldo Geral Acumulado em Caixa da Tesouraria: ${formatBRL(kpis.saldoAcumuladoTotal)}`;
  const infoLine2 = `• Taxa de Retenção Orçamentária: ${kpis.margemEconomia.toFixed(1)}% | Quantidade de Lançamentos no Período: ${movements.length}`;
  const infoLine3 = `• Projeção Metodológica: ${kpis.projecaoProximoMes.motivo}`;
  doc.text(infoLine1, 14, yPos);
  doc.text(infoLine2, 14, yPos + 4.5);
  doc.text(infoLine3, 14, yPos + 9);

  yPos += 16;

  // 4. Table of Movements
  const tableData = movements.map(m => [
    m.id,
    m.data,
    m.movimento,
    m.tipo === 'ENTRADA' ? 'ENTRADA' : 'SAÍDA',
    formatBRL(m.valor),
    m.transferencia,
    m.responsavel
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['ID', 'DATA', 'MOVIMENTO / HISTÓRICO', 'TIPO', 'VALOR', 'TRANSFERÊNCIA', 'RESPONSÁVEL']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240]
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 20 },
      2: { cellWidth: 60 },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 24, halign: 'right' },
      5: { cellWidth: 28 },
      6: { cellWidth: 32 }
    },
    didParseCell: (data) => {
      if (data.section === 'body') {
        if (data.column.index === 3) {
          const val = data.cell.raw as string;
          if (val === 'ENTRADA') {
            data.cell.styles.textColor = emeraldColor;
            data.cell.styles.fontStyle = 'bold';
          } else {
            data.cell.styles.textColor = roseColor;
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    }
  });

  // Calculate final Y after table
  // @ts-expect-error - jspdf-autotable adds lastAutoTable to jsPDF instance
  let finalY = doc.lastAutoTable?.finalY || 180;

  // If table went near bottom of page, add new page for signatures and breakdown
  if (finalY > 230) {
    doc.addPage();
    finalY = 25;
  } else {
    finalY += 12;
  }

  // 5. Category Summary Mini-Table
  const topEntradas = calculateCategoryBreakdown(movements, 'ENTRADA').slice(0, 4);
  const topSaidas = calculateCategoryBreakdown(movements, 'SAIDA').slice(0, 4);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Principais Fontes de Receita e Centros de Custo', 14, finalY);

  finalY += 4;
  const summaryBody: string[][] = [];
  const maxRows = Math.max(topEntradas.length, topSaidas.length);
  for (let i = 0; i < maxRows; i++) {
    const e = topEntradas[i];
    const s = topSaidas[i];
    summaryBody.push([
      e ? `${e.categoria} (${formatBRL(e.total)})` : '-',
      s ? `${s.categoria} (${formatBRL(s.total)})` : '-'
    ]);
  }

  autoTable(doc, {
    startY: finalY,
    head: [['PRINCIPAIS ENTRADAS', 'PRINCIPAIS SAÍDAS']],
    body: summaryBody,
    theme: 'striped',
    styles: { fontSize: 7.5, cellPadding: 2 },
    headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255] }
  });

  // @ts-expect-error - jspdf-autotable
  finalY = (doc.lastAutoTable?.finalY || finalY) + 18;

  if (finalY > 245) {
    doc.addPage();
    finalY = 30;
  }

  // 6. Signature Lines
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  // Line 1: Tesouraria
  doc.line(18, finalY + 12, 85, finalY + 12);
  doc.text('Tesouraria - Grupo de Mulheres', 25, finalY + 17);
  doc.text('3ª IPI do Natal', 36, finalY + 21);

  // Line 2: Liderança / Presidente
  doc.line(125, finalY + 12, 192, finalY + 12);
  doc.text('Liderança / Presidência SAF', 135, finalY + 17);
  doc.text('3ª IPI do Natal', 144, finalY + 21);

  // Save PDF
  const filename = options.fileName || `Relatorio_Financeiro_3IPI_Mulheres_${selectedMonth.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
