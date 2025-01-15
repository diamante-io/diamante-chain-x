export function emailValidation(emailId) {
  if (!emailId || emailId === "") return false;
  const regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (regex.test(emailId) === false) return false;
  return true;
}
