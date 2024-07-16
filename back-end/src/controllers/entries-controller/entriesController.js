const { Entries } = require("../../models/Entries.js");
const validations = require("../../utils/validationCall.js");
const mapper = require("../../mappers/entrie-mapper.js");

module.exports = {
  getAllEntries: async (req, res) => {
    try {
      const response = Entries.find();
      if (!response.erros) {
        return res.status(200).json({ msg: "OK", result: response });
      } else {
        return res.status(404).json({ msg: "None:", result: response });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Internal server error", result: null });
    }
  },
  getByEntrieById: async (req, res) => {},
  insertEntrie: async (req, res) => {},
  deleteEntrie: async (req, res) => {},
};
