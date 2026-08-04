import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Caixa Financeiro - Grupo de Mulheres 3ª IPI do Natal' });
  });

  // Gemini AI Financial Insights endpoint
  app.post('/api/financial-insights', async (req, res) => {
    try {
      const { selectedMonth, kpis, monthlySummaries, topEntradas, topSaidas, responsibles } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({
          fallback: true,
          message: 'API Key não configurada. Usando motor local de diagnósticos.'
        });
      }

      const prompt = `
Você é uma consultora financeira e especialista em tesouraria ministerial e eclesiástica da 3ª Igreja Presbiteriana Independente de Natal (RN), prestando assessoria ao Grupo de Mulheres / SAF (Sociedade Auxiliadora Feminina).

Analise os seguintes dados consolidados da tesouraria para o período "${selectedMonth}":
- Total de Entradas (Receitas): R$ ${kpis?.totalEntradas || 0}
- Total de Saídas (Despesas): R$ ${kpis?.totalSaidas || 0}
- Saldo do Período: R$ ${kpis?.saldoPeriodo || 0}
- Saldo Geral Acumulado em Caixa: R$ ${kpis?.saldoAcumuladoTotal || 0}
- Projeção de Saldo para o Próximo Mês: R$ ${kpis?.projecaoProximoMes?.saldoEstimado || 0}
- Margem de Retenção: ${kpis?.margemEconomia || 0}%

Principais Entradas:
${JSON.stringify(topEntradas?.slice(0, 5) || [])}

Principais Saídas:
${JSON.stringify(topSaidas?.slice(0, 5) || [])}

Distribuição por Responsável:
${JSON.stringify(responsibles?.slice(0, 5) || [])}

Histórico dos Meses:
${JSON.stringify(monthlySummaries || [])}

Gere um parecer executivo, pastoral e orçamentário completo, equilibrando responsabilidade cristã, zelo administrativo e estratégias para eventos do ministério de mulheres (como Chás, Retiros, Bazar, Cantina e Ação Social).
`;

      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Você é uma auditora e consultora financeira eclesiástica da 3ª IPI do Natal. Retorne a resposta estritamente no formato JSON estruturado definido no responseSchema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scoreSaude: {
                type: Type.NUMBER,
                description: 'Pontuação de saúde financeira de 0 a 100.'
              },
              nivelSaude: {
                type: Type.STRING,
                description: 'Nível de saúde: Excelente, Saudável, Atenção ou Crítico.'
              },
              resumoExecutivo: {
                type: Type.STRING,
                description: 'Parecer executivo detalhado sobre as contas do período.'
              },
              destaquesPositivos: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Lista de 3 a 5 pontos fortes e sucessos financeiros.'
              },
              alertasAtencao: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Lista de alertas de risco ou pontos de atenção orçamentária.'
              },
              recomendacoesOrcamentarias: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Recomendações práticas para a tesouraria e diretoria.'
              },
              projecaoProximoMesTexto: {
                type: Type.STRING,
                description: 'Análise aprofundada da projeção de saldo para o próximo mês.'
              },
              sugestoesEventosFuturos: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Sugestões de eventos e ações de captação de recursos para o ministério de mulheres.'
              }
            },
            required: [
              'scoreSaude',
              'nivelSaude',
              'resumoExecutivo',
              'destaquesPositivos',
              'alertasAtencao',
              'recomendacoesOrcamentarias',
              'projecaoProximoMesTexto',
              'sugestoesEventosFuturos'
            ]
          }
        }
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json({ success: true, insight: parsed });
    } catch (error: any) {
      console.error('Error generating AI insights:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao gerar parecer com IA. Usando motor local.'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
