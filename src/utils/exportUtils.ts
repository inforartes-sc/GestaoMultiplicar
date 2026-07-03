import * as XLSX from 'xlsx';
import { Eleitor, User } from '../types';

/**
 * Exporta lista de eleitores para arquivo Excel (.XLSX)
 */
export function exportEleitoresToExcel(eleitores: Eleitor[], nomeArquivo = 'Cadastro_Eleitores') {
  const dadosFormatados = eleitores.map((e) => ({
    'ID': e.id,
    'Multiplicador Responsável': e.multiplicadorNome,
    'Nome Completo': e.nomeCompleto,
    'CPF': e.cpf,
    'RG': e.rg,
    'Data de Nascimento': e.dataNascimento ? new Date(e.dataNascimento).toLocaleDateString('pt-BR') : '',
    'Sexo': e.sexo,
    'Telefone': e.telefone,
    'WhatsApp': e.whatsapp,
    'E-mail': e.email,
    'CEP': e.cep,
    'Rua': e.rua,
    'Número': e.numero,
    'Bairro': e.bairro,
    'Cidade': e.cidade,
    'Estado': e.estado,
    'Título de Eleitor': e.tituloEleitor,
    'Zona Eleitoral': e.zonaEleitoral,
    'Seção': e.secao,
    'Município Votação': e.municipioVota,
    'Local de Votação': e.localVotacao,
    'Situação Eleitoral': e.situacaoEleitor,
    'Apoia Candidato?': e.apoiaCandidato ? 'Sim' : 'Não',
    'Já Votou Antes?': e.jaVotouAnteriormente ? 'Sim' : 'Não',
    'Líder Comunitário?': e.liderComunitario ? 'Sim' : 'Não',
    'Influenciador?': e.influenciador ? 'Sim' : 'Não',
    'Qtd. Influenciados': e.quantidadeInfluenciados || 0,
    'Data de Cadastro': new Date(e.dataCadastro).toLocaleString('pt-BR'),
    'Consentimento LGPD': e.consentimentoLGPD ? 'ACEITO' : 'PENDENTE',
    'IP Consentimento': e.ipConsentimento || 'N/A',
  }));

  const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Eleitores');
  
  // Ajustar largura aproximada das colunas
  worksheet['!cols'] = [
    { wch: 10 }, { wch: 28 }, { wch: 30 }, { wch: 16 }, { wch: 14 },
    { wch: 15 }, { wch: 8 }, { wch: 16 }, { wch: 16 }, { wch: 25 },
    { wch: 12 }, { wch: 25 }, { wch: 8 }, { wch: 20 }, { wch: 18 },
    { wch: 6 }, { wch: 16 }, { wch: 10 }, { wch: 8 }, { wch: 18 }
  ];

  XLSX.writeFile(workbook, `${nomeArquivo}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Exporta lista de eleitores para arquivo CSV
 */
export function exportEleitoresToCSV(eleitores: Eleitor[], nomeArquivo = 'Cadastro_Eleitores') {
  const dadosFormatados = eleitores.map((e) => ({
    'ID': e.id,
    'Multiplicador': e.multiplicadorNome,
    'Nome': e.nomeCompleto,
    'CPF': e.cpf,
    'WhatsApp': e.whatsapp,
    'Cidade': e.cidade,
    'Bairro': e.bairro,
    'Zona': e.zonaEleitoral,
    'Secao': e.secao,
    'Apoia': e.apoiaCandidato ? 'Sim' : 'Não',
    'Lider': e.liderComunitario ? 'Sim' : 'Não',
  }));

  const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${nomeArquivo}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Gera relatório formatado de Eleitores ou Multiplicadores para Impressão/PDF
 */
export function printOrExportPDF(titulo: string, subtitulo: string, cabecalhos: string[], linhas: (string | number)[][]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para gerar a impressão ou PDF.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>${titulo}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #1e293b; }
        .header { border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
        .header h1 { margin: 0; font-size: 22px; color: #1e3a8a; }
        .header p { margin: 4px 0 0; font-size: 13px; color: #64748b; }
        .date { font-size: 12px; color: #64748b; text-align: right; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
        th { background-color: #f1f5f9; color: #334155; text-align: left; padding: 10px 8px; font-weight: 600; border-bottom: 2px solid #cbd5e1; }
        td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>${titulo}</h1>
          <p>${subtitulo}</p>
        </div>
        <div class="date">
          Emitido em: ${new Date().toLocaleString('pt-BR')}<br>
          Conformidade LGPD • Relatório Oficial
        </div>
      </div>
      <table>
        <thead>
          <tr>
            ${cabecalhos.map(c => `<th>${c}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${linhas.map(l => `
            <tr>
              ${l.map(cell => `<td>${cell ?? ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        Este documento contém dados pessoais protegidos pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD). Uso restrito e confidencial.
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
