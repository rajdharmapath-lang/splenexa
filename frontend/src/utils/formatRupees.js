const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export default function formatRupees(amount) {
  if (!Number.isFinite(amount)) {
    throw new TypeError('Amount must be a finite number');
  }
  return rupeeFormatter.format(amount);
}
