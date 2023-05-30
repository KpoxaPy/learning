export default function memoCount() {
  let count = 0;
  return () => {
    return ++count;
  };
};
