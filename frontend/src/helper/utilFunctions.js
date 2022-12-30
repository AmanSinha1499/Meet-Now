export const split = (x) => {
  let n = Math.floor(Math.sqrt(x));
  let zp = n - (x % n);
  let pp = Math.floor(x / n);
  let m = [];
  for (let i = 0; i < n; i++) {
    if (i >= zp) {
      m.push(pp + 1);
    } else {
      m.push(pp);
    }
  }
  m = m.reverse();
  let res = {};
  let count = 1;
  let idx = 0;
  for (let i = 1; i <= x; i++) {
    res[i] = m[idx];
    count++;
    if (count > m[idx]) {
      count = 1;
      idx++;
    }
  }
  res["rows"] = m.length;
  return res;
};

export function detectURL(message) {
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return message.replace(urlRegex, function (urlMatch) {
    return `<a href=${urlMatch} target="_blank" >${urlMatch}</a>`;
  });
}
export function sanitize(string) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  const reg = /[&<>"'/]/gi;
  return string.replace(reg, (match) => map[match]);
}

export const getFullName = (firstName, lastName) => {
  const fullName = firstName + " " + lastName;
  return fullName.trim();
};
