function formatNumber(n) {
  return Number.parseFloat(String(n)).toLocaleString('en-IN');
}

function formatDuration(millisec) {
  if (!millisec || !Number(millisec)) return '0 Second';
  const seconds = Math.round((millisec % (60 * 1000)) / 1000);
  const minutes = Math.floor((millisec % (60 * 60 * 1000)) / (60 * 1000));
  const hours = Math.floor(millisec / (60 * 60 * 1000));

  if (hours > 0) return `${hours} Hour, ${minutes} Minute & ${seconds} Second`;
  if (minutes > 0) return `${minutes} Minute & ${seconds} Second`;
  return `${seconds} Second`;
}
module.exports = {
  formatNumber,
  formatDuration,
};
