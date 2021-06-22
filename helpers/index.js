var schema = {
  name: function (value) {
    return true; ///^([A-Z][a-z\-]* )+[A-Z][a-z\-]*( \w+\.?)?$/.test(value);
  },
  company_name: function (value) {
    return true; // /^([A-Z][a-z\-]* )+[A-Z][a-z\-]*( \w+\.?)?$/.test(value);
  },
  email: function (value) {
    return true; // /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
  },
  phone: function (value) {
    return true; ///^(\+?\d{1,2}-)?\d{3}-\d{3}-\d{4}$/.test(value);
  },
};
const removeEmpty = (obj) => {
  Object.entries(obj).forEach(
    ([key, val]) =>
      (val && typeof val === "object" && removeEmpty(val)) ||
      ((val === null || val === "") && delete obj[key])
  );
  return obj;
};

const validate = (object, schema) =>
  Object.entries(schema)
    .map(([key, validate]) => [
      key,
      !validate.required || key in object,
      validate(object[key]),
    ])
    .filter(([_, ...tests]) => !tests.every(Boolean))
    .map(([key, invalid]) => {
      return {
        [key]: `${key} is ${invalid ? "invalid" : "required"}.`,
      };
    });

const validateAll = (arr) => {
  const errors = [];
  const result = [];
  arr.map((lead) => {
    const val = validate(lead, schema);
    if (val.length > 0) {
      errors.push({ ...val });
    } else {
      result.push({ ...lead });
    }
  });
  if (errors.length > 0) return { valid: false, ...errors };
  else return { valid: true, ...result };
};

module.exports = {
  removeEmpty,
  validateAll,
};


