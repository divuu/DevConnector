const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";

  if (!Validator.isEmpty(data.school)) {
    errors.school = "School is Required";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree is Required";
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Field of study date Field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
