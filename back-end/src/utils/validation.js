const validations = {
  CPFValidation: function CPFValidation(strCPF) {
    var soma;
    var resto;
    var retorno = true;
    soma = 0;
    if (strCPF == "00000000000") retorno = false;

    for (i = 1; i <= 9; i++)
      soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(strCPF.substring(9, 10))) retorno = false;

    soma = 0;
    for (i = 1; i <= 10; i++)
      soma = soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(strCPF.substring(10, 11))) retorno = false;

    return retorno;
  },
  contactValidation: function contactValidation(contact) {
    let numRegex = /^\d{11}$/;
    return numRegex.test(contact);
  },
  nullValidation: function nullValidation(name, contact) {
    return name != "" || contact != "";
  },
};

module.exports = validations;
