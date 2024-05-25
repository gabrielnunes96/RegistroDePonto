const querys = {
  getAll: function getAll(_obj) {
    return `SELECT * FROM ${_obj.tableName}`;
  },
  getById: function getById(_obj) {
    return `SELECT * FROM ${_obj.tableName} WHERE id = '${_obj.id}'`;
  },
  insert: function insert(_obj) {
    const columns = Object.keys(_obj.columns);
    const values = Object.values(_obj.columns);
    const formattedColumns = columns.map((col) => `${col}`).join(", ");
    const formattedValues = values.map((val) => `'${val}'`).join(", ");
    return `INSERT INTO ${_obj.tableName} (${formattedColumns}) VALUES (${formattedValues})`;
  },
  updateById: function update(_obj) {
    const columns = Object.keys(_obj.columns);
    const values = Object.values(_obj.columns);

    // Create a SET clause with placeholders for updated values:
    const formattedSetClause = columns
      .map((col, index) => `${col} = '${values[index]}'`)
      .join(", ");

    return `UPDATE ${_obj.tableName} SET ${formattedSetClause} WHERE id = ${_obj.id}`;
  },
  deleteById: function deleteById(_obj) {
    return `DELETE FROM ${_obj.tableName} WHERE id = '${_obj.id}'`;
  },
};

module.exports = querys;
