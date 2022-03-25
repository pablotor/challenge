// from https://stackoverflow.com/questions/25317997/function-to-create-a-valid-id-from-string-regular-expression
export default (title: string) => title.replace(/\W/g, '_');
