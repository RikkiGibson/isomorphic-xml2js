
exports.normalize = (str: string) => str.toLowerCase();

exports.firstCharLowerCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

exports.stripPrefix = (str: string) => str.replace(/(?!xmlns)^.*:/, '');

exports.parseNumbers = (str: any) => {
  if (!isNaN(str)) {
    str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
  }
  return str;
};

exports.parseBooleans = (str: any) => {
  if (/^(?:true|false)$/i.test(str)) {
    str = str.toLowerCase() === 'true';
  }
  return str;
};
