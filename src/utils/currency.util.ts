function toLocalCurrency(value: number, currencySign = true) {
  if (currencySign)
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  return value.toLocaleString('pt-br', { minimumFractionDigits: 2 });
}

export { toLocalCurrency };
