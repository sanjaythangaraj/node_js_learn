const getCurrentDateTime = () => new Date().toISOString();
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

// method 1: adding properties to exports (or module.exports)
// exports.getCurrentDateTime = getCurrentDateTime
// exports.formatCurrency = formatCurrency

// method 2: reassign module.exports
module.exports = {
    getCurrentDateTime,
    formatCurrency
}

