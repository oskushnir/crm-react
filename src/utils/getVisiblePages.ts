export const getVisiblePages = (current: number, total: number, isMobile: boolean): (number | 'ellipsis')[] => {
  const delta = isMobile ? 0 : 2;
  const range: (number | 'ellipsis')[] = [];
  const left = current - delta;
  const right = current + delta;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i <= right)) {
      range.push(i);
    } else if (
      i === left - 1 ||
      i === right + 1
    ) {
      range.push('ellipsis');
    }
  }

  return range.filter((item, idx, arr) => {
    return item !== 'ellipsis' || arr[idx - 1] !== 'ellipsis';
  });
};