import { isDate } from "./isDate";

export function getChangedFields<T extends Record<string, unknown>>(initial: T, current: T): Partial<T> {
  const changedFields: Partial<T> = {};

  for (const key in current) {
    if (!Object.prototype.hasOwnProperty.call(current, key)) continue;

    const initialValue = initial[key];
    const currentValue = current[key];

    const bothAreDateLike = isDate(initialValue) || isDate(currentValue);

    if (bothAreDateLike) {
      const initialDate = isDate(initialValue)
        ? initialValue.toISOString().slice(0, 10)
        : initialValue;

      const currentDate = isDate(currentValue)
        ? currentValue.toISOString().slice(0, 10)
        : currentValue;

      if (initialDate !== currentDate) {
        changedFields[key] = currentValue;
      }
    } else {
      if (initialValue !== currentValue) {
        changedFields[key] = currentValue;
      }
    }
  }

  return changedFields;
}