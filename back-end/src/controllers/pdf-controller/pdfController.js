const PdfPrinter = require("pdfmake");
const Entries = require("../../models/Entries.js");
const { format } = require("date-fns");
const { ptBR } = require("date-fns/locale");

// Usando as fontes padrão do pdfmake
const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

// Nova função para formatar horas (igual ao front-end)
const formatHours = (hours) => {
  if (isNaN(hours)) return "00:00";
  const sign = hours < 0 ? "-" : "";
  const absoluteHours = Math.abs(hours);
  const h = Math.floor(absoluteHours);
  const min = Math.round((absoluteHours - h) * 60);
  return `${sign}${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

module.exports = {
  generateEmployeeReportPdf: async (req, res) => {
    try {
      const { pin } = req.params;
      const { totalHours } = req.query;

      if (!pin) {
        return res.status(400).json({
          msg: "PIN do funcionário é obrigatório para o relatório PDF.",
          result: null,
        });
      }

      const employeeEntries = await Entries.find({ employeePin: pin }).sort({
        date: 1,
      });

      if (employeeEntries.length === 0) {
        return res.status(404).json({
          msg: "Nenhum registro de ponto encontrado para este funcionário para gerar o PDF.",
          result: [],
        });
      }

      // Preparar os dados para o PDF
      const tableBody = [
        [
          { text: "Data", bold: true },
          { text: "Tipo", bold: true },
          { text: "Hora", bold: true },
          { text: "Justificativa", bold: true },
          { text: "Atraso", bold: true },
        ],
      ];

      employeeEntries.forEach((entry) => {
        // Para cada entrada diária, iterar sobre os punches
        entry.punches.forEach((punch) => {
          const entryDate = format(new Date(entry.date), "dd/MM/yyyy", {
            locale: ptBR,
          });

          // Adicionar linha para Check-In
          if (punch.checkIn && punch.checkIn.time) {
            const checkInTime = format(new Date(punch.checkIn.time), "HH:mm", {
              locale: ptBR,
            });
            const checkInJustification =
              punch.checkIn.justification &&
              punch.checkIn.justification.length > 0
                ? punch.checkIn.justification.join("; ")
                : "";
            const checkInIsLate = punch.checkIn.isLate ? "Sim" : "Não";

            tableBody.push([
              entryDate,
              "Entrada",
              checkInTime,
              checkInJustification,
              checkInIsLate,
            ]);
          }

          // Adicionar linha para Check-Out, se existir
          if (punch.checkOut && punch.checkOut.time) {
            const checkOutTime = format(
              new Date(punch.checkOut.time),
              "HH:mm",
              {
                locale: ptBR,
              }
            );
            const checkOutJustification =
              punch.checkOut.justification &&
              punch.checkOut.justification.length > 0
                ? punch.checkOut.justification.join("; ")
                : "";
            const checkOutIsLate = punch.checkOut.isLate ? "Sim" : "Não";

            tableBody.push([
              entryDate,
              "Saída",
              checkOutTime,
              checkOutJustification,
              checkOutIsLate,
            ]);
          }
        });
      });

      const docDefinition = {
        content: [
          {
            text: `Histórico de Ponto do Funcionário: ${
              employeeEntries[0].employeeName || pin
            }`,
            style: "header",
          },
          { text: "\n" },
          {
            table: {
              headerRows: 1,
              widths: ["auto", "auto", "auto", "*", "auto"],
              body: tableBody,
            },
            layout: "lightHorizontalLines", // Outros layouts: 'noBorders', 'headerLineOnly', 'lightHorizontalLines'
          },
          { text: "\n\n" }, // Espaço antes do total de horas
          {
            text: `Total de Horas Trabalhadas: ${formatHours(totalHours)}`,
            alignment: "right",
            style: "totalHours",
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
          },
          totalHours: {
            fontSize: 14,
            bold: true,
            margin: [0, 20, 0, 0], // Margem superior para separar do conteúdo
          },
        },
      };

      const pdfDoc = printer.createPdfKitDocument(docDefinition);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=historico_ponto.pdf"
      );
      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      return res.status(500).json({
        msg: "Erro interno do servidor ao gerar PDF.",
        result: error.message,
      });
    }
  },
};
