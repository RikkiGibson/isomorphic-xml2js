
export const normalize = (str: string) => str.toLowerCase();

export const firstCharLowerCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

export const stripPrefix = (str: string) => str.replace(/(?!xmlns)^.*:/, '');

export const parseNumbers = (str: any) => {
  if (!isNaN(str)) {
    str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
  }
  return str;
};

export const parseBooleans = (str: any) => {
  if (/^(?:true|false)$/i.test(str)) {
    str = str.toLowerCase() === 'true';
  }
  return str;
};
