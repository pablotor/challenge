// Inspired by answer 3 of https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
// To be used only when order matters more than performance, as it executes only one call at a time
export default async <T>(
  array: T[],
  asyncFn: (p: T) => Promise<void>,
) => array.reduce(async (promise, element) => {
  await promise;
  return asyncFn(element);
}, Promise.resolve());
