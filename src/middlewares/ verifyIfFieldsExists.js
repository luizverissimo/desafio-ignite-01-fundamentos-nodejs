export function verifyIdExists(request, response, fields) {
  let missedField = [];
  for (let field in fields) {
    let keys = Object.keys(request.body);
    if (!keys.includes(fields[field])) {
      missedField.push(fields[field]);
    }
  }
  return missedField;
}
