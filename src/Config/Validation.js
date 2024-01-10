import { toast } from "react-toastify";

const validateFields = (fields, additionalChecks = []) => {
  // Check for empty fields
  for (const key in fields) {
    if (
      fields[key] === "" ||
      (Array.isArray(fields[key]) && fields[key].length === 0)
    ) {
      toast.error(`Please enter ${key}`);
      return false;
    }
  }
  // Run additional checks (like password matching)
  for (const check of additionalChecks) {
    if (!check.condition()) {
      toast.error(check.errorMessage);
      return false;
    }
  }

  return true;
};

export default validateFields;
