const mappers = {
  mapToEntrie: function mapToEntrie(reqBody, response) {
    const entrie = {
      punchIn: reqBody.punchIn ? reqBody.punchIn : response.punchIn,
      punchOut: reqBody.punchOut ? reqBody.punchOut : response.punchOut,
      employeePin: reqBody.employeePin
        ? reqBody.employeePin
        : response.employeePin,
      employeeNAme: reqBody.employeeName
        ? reqBody.employeeName
        : response.employeeName,
    };

    return entrie;
  },
};
module.exports = mappers;
