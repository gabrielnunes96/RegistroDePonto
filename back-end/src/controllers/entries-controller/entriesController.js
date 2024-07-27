const Entries = require("../../models/Entries.js");
const validationCall = require("../../validations/validation-call.js");
const mapper = require("../../mappers/entries-mapper.js");

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
      let msg = validationCall.execEntriesValidations(req.body);
      if (!msg == "") {
        return res.status(404).json({ msg: msg, result: null });
      }
      const response = await Entries.create(mapper.mapToEntrie(req.body));
      if (response) {
        return res.status(201).json({ msg: "Created" });
      } else {
        return res.status(404).json({
          msg: "Error while creating entrie",
          result: response.errors,
        });
      }
    } catch (erro) {
      return res
        .status(500)
        .json({ msg: "Internal server error", result: erro.message });
    }
  },
  updateEntrie: async (req, res) => {
    try {
      let oldValue = await Entries.findById(req.params.id);
      let newValue = mapper.mapToEntrie(req.body, oldValue);
      let msg = validationCall.execEntriesValidations(newValue);
      if (!msg == "") {
        return res.status(400).json({ msg: msg, result: msg });
      }
      const response = await Entries.findByIdAndUpdate(
        req.params.id,
        newValue,
        {
          returnDocument: "after",
        }
      );
      if (response) {
        return res.status(200).json({ msg: "Updated", result: response });
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
