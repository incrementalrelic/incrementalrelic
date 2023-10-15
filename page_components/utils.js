
const formatNumber = (number, decimal, wrap) => {
    const res = Number(number || 0) >= 10000 ? Number(number || 0).toExponential(2) : Number(number || 0).toFixed(Number(decimal === 0 ? 0 : decimal || 2))
    if(Number(number || 0) >= 10000 || !wrap){
        return res;
    }
    return Number(res);
}

module.exports = {
    formatNumber
}
  