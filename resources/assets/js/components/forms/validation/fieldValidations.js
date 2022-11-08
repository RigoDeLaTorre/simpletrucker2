// export function firstName(values) {
//   console.log("this is running");
//   if (!values.load_reference) {
//     errors.load_reference = "Enter a driver !";
//   } else if (values.load_reference.length > 50) {
//     errors.load_reference = `Must be 50 characters or less`;
//   }
// }

export const required = value =>
  value || value === 0 ? undefined : "Required";

export const requiredTrim = value =>
  value.trim() == "" ? "Required" : undefined;
export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

export const maxLength4 = maxLength(4);
export const maxLength10 = maxLength(10);
export const maxLength20 = maxLength(20);
export const maxLength50 = maxLength(50);
export const maxLength100 = maxLength(100);
export const maxLength200 = maxLength(200);

export const minLength = min => value =>
  value && value.length < min ? `Must be at least ${min} digits` : undefined;
export const minLength4 = minLength(4);
export const minLength5 = minLength(5);
export const minLength12 = minLength(12);
export const minLengthPhone = value =>
  value && value.length < 12 ? `Must be at least 10 digits` : undefined;

export const number = value =>
  //With Comma
  // value && /^(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?$/.test(value)
  value && /^(?:\d{1,3}(?:\d{3})+|\d+)(?:\.\d+)?$/.test(value) === false
    ? "Invalid format, use $00.00"
    : undefined;

export const email = value =>
  value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export const onlyInteger = value =>
  value && /^[0-9]*[1-9][0-9]*$/.test(value) === false
    ? "Numbers Only"
    : undefined;
