const mappers = {
  mapToEntrie: function mapToEntrie(reqBody, existingEntry = null) {
    const entrie = {
      employeePin: reqBody.employeePin || existingEntry?.employeePin || null,
      employeeName: reqBody.employeeName || existingEntry?.employeeName || null,
    };
    return entrie;
  },
};
module.exports = mappers;
