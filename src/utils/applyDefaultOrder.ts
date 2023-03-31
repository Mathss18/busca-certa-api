export function applyDefaultOrder(
  field = 'id',
  order: 'asc' | 'desc' = 'desc',
) {
  return {
    [field]: order,
  };
}
