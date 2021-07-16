const phoneValidate = phone => {
  const expression = /(09|01[2|6|8|9]|03)+([0-9]{8})\b|(84)+([0-9]{9})\b/i;
  return expression.test(String(phone).toLowerCase());
};

const emailValidate = email => {
  const expression = /^[\w-\+]+(\.[\w]+)*@[\w-]+(\.[\w]+)*(\.[a-z]{2,})$/i;
  return expression.test(String(email).toLowerCase());
};

export {phoneValidate, emailValidate};
