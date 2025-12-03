import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { File, Directory, Paths } from "expo-file-system";

export async function generateRelatoriosPDF(listaOriginal, filters, helpers) {
  try {
    const html = `
    <html>
    <head>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 28px;
            margin-top: 10px !important;
            color: #333333;
        }

        /* Simulação da fonte Inspiration */
        @font-face {
            font-family: 'Inspiration';
            src: local('Inspiration-Regular');
        }

        .title {
            text-align: center;
            margin-bottom: 35px;
            padding: 20px;
            color: #333333;
            border-radius: 14px;
        }

        .agendaGlow {
            font-family: 'Inspiration', cursive;
            font-size: 45px;
            color: #a3564aff;
            margin: 0;
            margin-bottom: 10px;
        }

        h1 {
            margin: 0;
            font-size: 26px;
            font-weight: bold;
        }

        h2 {
            font-size: 20px;
            color: #a3564aff;
            margin-top: 35px;
            margin-bottom: 20px; /* mais espaço antes da tabela */
        }

        p {
            margin: 6px 0;
            font-size: 14px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            border: 4px solid #684040ff;
        }

        thead {
            background: #FFE8DB;
        }

        th {
            padding: 12px;
            font-size: 14px;
            text-align: left;
            color: #333333;
            border-bottom: 2px solid #E0E0E0;
        }

        td {
            padding: 10px;
            font-size: 13px;
            color: #333333;
            border-bottom: 1px solid #E0E0E0;
        }

        /* Margem das páginas do PDF */
        @page {
            margin-top: 2cm;
            margin-bottom: 2cm;

            @top-center {
                content: "Relatório de Atendimentos Concluídos";
                font-size: 10px;
                color: #777;
            }
            @bottom-right {
                content: "Página " counter(page);
                font-size: 10px;
                color: #777;
            }
        }
    </style>
    </head>

    <body>
    <div class="title">
        <h1 class="agendaGlow">AgendaGlow</h1>
        <h1>Relatório de Atendimentos</h1>
        <p><strong>Gerado em:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
        ${filters.date ? `<p><strong>Data filtrada:</strong> ${filters.date}</p>` : ""}
    </div>

    <table>
    <thead>
    <tr>
        <th>Data</th>
        <th>Horário</th>
        <th>Cliente</th>
        <th>Serviço(s)</th>
        <th>Profissional</th>
        <th>Valor</th>
    </tr>
    </thead>

    <tbody>
    ${listaOriginal.map(a => `
    <tr>
        <td>${a.data || "-"}</td>
        <td>${a.horario || "-"}</td>
        <td>${helpers.getClienteNome(a.cliente)}</td>
        <td>${helpers.getServicoNome(a.servicos || a.servico)}</td>
        <td>${helpers.getFuncionarioNome(a.profissionais || a.profissional)}</td>
        <td>R$ ${a.valor || "-"}</td>
    </tr>
    `).join("")}
    </tbody>
    </table>

    </body>
    </html>
    `;

    const { uri: tempUri } = await Print.printToFileAsync({ html });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `Relatorio-atendimentos-${timestamp}.pdf`;

    const reportsDir = new Directory(Paths.document, "reports");
    if (!(await reportsDir.exists)) await reportsDir.create();

    const destFile = new File(reportsDir, fileName);
    const srcFile = new File(tempUri);

    await srcFile.move(destFile);
    await Sharing.shareAsync(destFile.uri);

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}
