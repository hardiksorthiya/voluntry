// Validation utilities for MySQL

export const isValidId = (id) => {
  if (!id) return false;
  // For MySQL, IDs are integers
  const numId = parseInt(id, 10);
  return !isNaN(numId) && numId > 0;
};

export const toId = (id) => {
  if (typeof id === "number") return id;
  const numId = parseInt(id, 10);
  return isNaN(numId) ? null : numId;
};

