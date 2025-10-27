import { calculateAdvancedLoanCombined, calculateLoanCombined, generateAmortizationTable } from './loan_helper/loan_logic.js';

// Initialize loan calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Toggle Advanced Options
    const toggleBtn = document.getElementById('toggleAdvanced');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const advancedOptions = document.getElementById('advancedOptions');
            const isHidden = advancedOptions.style.display === 'none';
            advancedOptions.style.display = isHidden ? 'block' : 'none';
            this.textContent = isHidden ? 'Hide Advanced Options' : 'Show Advanced Options';
        });
    }

    // Add event listener for loan form (handles both basic and advanced)
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
        loanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if advanced options are being used
            const extraPayment = parseFloat(document.getElementById('extra_payment').value) || 0;
            const lumpSum = parseFloat(document.getElementById('lump_sum').value) || 0;
            const lumpSumMonth = parseInt(document.getElementById('lump_sum_month').value) || 0;
            
            // If any advanced options are set, use advanced calculation
            if (extraPayment > 0 || (lumpSum > 0 && lumpSumMonth > 0)) {
                calculateAdvancedLoanCombined();
            } else {
                calculateLoanCombined();
            }
            
            // Show the amortization button after calculation
            document.getElementById('showAmortization').style.display = 'block';
        });
    }

    // Add event listener for amortization table generation
    const showAmortizationBtn = document.getElementById('showAmortization');
    if (showAmortizationBtn) {
        let isShowing = false;
        showAmortizationBtn.addEventListener('click', function() {
            const principal = parseFloat(document.getElementById('loan_amount').value);
            const annualRate = parseFloat(document.getElementById('interest_rate').value);
            const termMonths = parseInt(document.getElementById('loan_term').value);
            
            if (!isNaN(principal) && !isNaN(annualRate) && !isNaN(termMonths)) {
                const container = document.getElementById('amortizationTable');
                if (isShowing) {
                    container.innerHTML = '';
                    this.textContent = 'Show Detailed Amortization Schedule';
                    isShowing = false;
                } else {
                    generateAmortizationTable(principal, annualRate, termMonths, 'amortizationTable');
                    this.textContent = 'Hide Amortization Schedule';
                    isShowing = true;
                }
            }
        });
    }
});
