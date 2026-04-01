/**
 * Formats a number as Indian Rupees (INR).
 * @param {number|string} amount - The amount to format.
 * @returns {string} - The formatted string (e.g., "₹1,00,000").
 */
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === '') return '₹0';

    const num = Number(amount);

    if (isNaN(num)) return '₹0';

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(num);
};

// Currency standardized to INR (₹)
