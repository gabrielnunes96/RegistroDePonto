const Entries = require("../../models/Entries.js");
const Employee = require("../../models/Employees.js");
const validationCall = require("../../validations/validation-call.js");
const mapper = require("../../mappers/entries-mapper.js");
const bcrypt = require("bcrypt");

module.exports = {
  getAllEntries: async (req, res) => {
    try {
      const response = await Entries.find();
      if (response != null) {
        return res.status(200).json({ msg: "OK", result: response });
      } else {
        return res.status(404).json({ msg: "None:", result: response });
      }
    } catch (erro) {
      return res
        .status(500)
        .json({ msg: "Internal server error", result: erro.message });
    }
  },
  getByEntrieById: async (req, res) => {
    try {
      const response = await Entries.findById(req.params.id);
      if (response != null) {
        return res.status(200).json({ msg: "OK", result: response });
      } else {
        return res
          .status(404)
          .json({ msg: "Entrie not found", result: response });
      }
    } catch (erro) {
      return res
        .status(500)
        .json({ msg: "Internal server error", result: erro.message });
    }
  },
  insertEntrie: async (req, res) => {
    try {
      const { pin, password, justification, isLate } = req.body;
      const currentTime = new Date();
      let operationType;

      if (!pin || !password) {
        return res
          .status(400)
          .json({ msg: "PIN e senha são obrigatórios.", result: null });
      }

      const employee = await Employee.findOne({ pin });
      if (!employee) {
        return res
          .status(404)
          .json({ msg: "Funcionário não encontrado.", result: null });
      }

      const passwordMatch = await bcrypt.compare(password, employee.password);
      if (!passwordMatch) {
        return res
          .status(401)
          .json({ msg: "PIN ou senha inválidos.", result: null });
      }

      const today = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate()
      );

      let existingEntry = await Entries.findOne({
        employeePin: pin,
        date: today,
      });

      if (existingEntry) {
        const lastPunch =
          existingEntry.punches[existingEntry.punches.length - 1];

        let isIntendedCheckout = false;
        if (justification && justification.includes("retorno em atraso")) {
          isIntendedCheckout = true;
        }

        if (isIntendedCheckout) {
          let openPunch = null;
          for (let i = existingEntry.punches.length - 1; i >= 0; i--) {
            if (
              !existingEntry.punches[i].checkOut ||
              !existingEntry.punches[i].checkOut.time
            ) {
              openPunch = existingEntry.punches[i];
              break;
            }
          }

          if (openPunch) {
            openPunch.checkOut = { time: currentTime };
            if (justification !== undefined && justification !== null) {
              if (!openPunch.checkOut.justification) {
                openPunch.checkOut.justification = [];
              }
              openPunch.checkOut.justification.push(justification);
            }
            if (isLate !== undefined) {
              openPunch.checkOut.isLate = isLate;
            }
            operationType = "saida";
          } else {
            return res.status(400).json({
              msg: "Para registrar uma saída com justificativa 'retorno em atraso', deve haver uma entrada anterior sem saída.",
              result: null,
            });
          }
        } else if (
          lastPunch &&
          (!lastPunch.checkOut || !lastPunch.checkOut.time)
        ) {
          lastPunch.checkOut = { time: currentTime };
          if (justification !== undefined && justification !== null) {
            if (!lastPunch.checkOut.justification) {
              lastPunch.checkOut.justification = [];
            }
            lastPunch.checkOut.justification.push(justification);
          }
          if (isLate !== undefined) {
            lastPunch.checkOut.isLate = isLate;
          }
          operationType = "saida";
        } else {
          existingEntry.punches.push({
            checkIn: {
              time: currentTime,
              justification: isLate && justification ? [justification] : [],
              isLate: isLate || false,
            },
            checkOut: null,
          });
          operationType = "entrada";
        }
        await existingEntry.save();
        const currentPunchForResponse =
          existingEntry.punches[existingEntry.punches.length - 1];
        return res.status(200).json({
          msg: "Ponto atualizado com sucesso!",
          result: existingEntry,
          operationType: operationType,
          isLate:
            currentPunchForResponse.checkOut?.isLate ||
            currentPunchForResponse.checkIn?.isLate,
        });
      } else {
        const newEntry = await Entries.create({
          employeePin: pin,
          employeeName: employee.name,
          date: today,
          punches: [
            {
              checkIn: {
                time: currentTime,
                justification: isLate && justification ? [justification] : [],
                isLate: isLate || false,
              },
              checkOut: null,
            },
          ],
        });
        return res.status(201).json({
          msg: "Ponto registrado com sucesso!",
          result: newEntry,
          operationType: "entrada",
          isLate: newEntry.punches[0].checkIn.isLate,
        });
      }
    } catch (error) {
      console.error("Erro ao registrar ponto:", error);
      return res
        .status(500)
        .json({ msg: "Erro interno do servidor.", result: error.message });
    }
  },
  getEmployeeEntriesByPin: async (req, res) => {
    try {
      const { pin } = req.params;
      const { startDate, endDate } = req.query;

      if (!pin) {
        return res
          .status(400)
          .json({ msg: "PIN do funcionário é obrigatório.", result: null });
      }

      let query = { employeePin: pin };

      if (startDate && endDate) {
        // Convertendo as strings de data para objetos Date para a query do MongoDB
        // Ajustando para cobrir o dia inteiro no fuso horário local
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);

        query.date = {
          $gte: startOfDay,
          $lte: endOfDay,
        };
      }

      const employeeEntries = await Entries.find(query).sort({
        date: 1,
      });

      if (employeeEntries.length > 0) {
        return res.status(200).json({ msg: "OK", result: employeeEntries });
      } else {
        return res.status(404).json({
          msg: "Nenhum registro encontrado para este funcionário.",
          result: [],
        });
      }
    } catch (error) {
      console.error("Erro ao buscar histórico do funcionário:", error);
      return res
        .status(500)
        .json({ msg: "Erro interno do servidor.", result: error.message });
    }
  },
  deleteEntrie: async (req, res) => {
    try {
      const response = await Entries.findOneAndDelete(req.params.id);
      if (response) {
        return res.status(200).json({ msg: "Deleted", result: req.params.id });
      } else {
        return res
          .status(400)
          .json({ msg: "Bad Request", result: response.errors });
      }
    } catch (erro) {
      return res
        .status(500)
        .json({ msg: "Internal server error", result: erro.message });
    }
  },
};
