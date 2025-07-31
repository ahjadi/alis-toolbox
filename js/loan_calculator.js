// Loan Calculator with Early Payment Scenarios
// Compatible with Kuwait Salary Calculator project

class LoanCalculator {
    constructor(principal, annualRate, termMonths) {
        this.principal = principal;
        this.annualRate = annualRate;
        this.termMonths = termMonths;
        this.monthlyRate = annualRate / 100 / 12;
    }

    // Calculate standard monthly payment using loan formula
    calculateMonthlyPayment() {
        if (this.monthlyRate === 0) {
            return this.principal / this.termMonths;
        }
        
        const numerator = this.principal * this.monthlyRate * Math.pow(1 + this.monthlyRate, this.termMonths);
        const denominator = Math.pow(1 + this.monthlyRate, this.termMonths) - 1;
        return numerator / denominator;
    }

    // Generate complete amortization schedule
    generateAmortizationSchedule() {
        const monthlyPayment = this.calculateMonthlyPayment();
        let remainingBalance = this.principal;
        const schedule = [];

        for (let month = 1; month <= this.termMonths; month++) {
            const interestPayment = remainingBalance * this.monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            remainingBalance = Math.max(0, remainingBalance - principalPayment);

            schedule.push({
                month: month,
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: remainingBalance
            });

            if (remainingBalance <= 0) break;
        }

        return schedule;
    }

    // Calculate early payment scenarios
    calculateEarlyPaymentScenario(extraMonthlyPayment = 0, lumpSumPayment = 0, lumpSumMonth = 0) {
        const baseMonthlyPayment = this.calculateMonthlyPayment();
        let remainingBalance = this.principal;
        const schedule = [];
        let month = 0;
        let totalInterest = 0;

        while (remainingBalance > 0.01 && month < this.termMonths) {
            month++;
            
            const interestPayment = remainingBalance * this.monthlyRate;
            let monthlyPayment = baseMonthlyPayment + extraMonthlyPayment;
            
            // Apply lump sum payment if specified
            if (month === lumpSumMonth && lumpSumPayment > 0) {
                monthlyPayment += lumpSumPayment;
            }

            // Don't overpay
            if (monthlyPayment > remainingBalance + interestPayment) {
                monthlyPayment = remainingBalance + interestPayment;
            }

            const principalPayment = monthlyPayment - interestPayment;
            remainingBalance = Math.max(0, remainingBalance - principalPayment);
            totalInterest += interestPayment;

            schedule.push({
                month: month,
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: remainingBalance
            });

            if (remainingBalance <= 0) break;
        }

        return {
            schedule: schedule,
            totalMonths: month,
            totalInterest: totalInterest,
            totalPayment: this.principal + totalInterest,
            monthsSaved: this.termMonths - month
        };
    }

    // Calculate savings from different payment strategies
    calculatePaymentStrategies() {
        const baseScenario = this.calculateEarlyPaymentScenario(0, 0, 0);
        
        const strategies = [
            { name: "Standard Payment", extra: 0, lump: 0, month: 0 },
            { name: "Extra KWD 50/month", extra: 50, lump: 0, month: 0 },
            { name: "Extra KWD 100/month", extra: 100, lump: 0, month: 0 },
            { name: "Extra KWD 200/month", extra: 200, lump: 0, month: 0 },
            { name: "KWD 1000 lump sum (Month 12)", extra: 0, lump: 1000, month: 12 },
            { name: "KWD 2000 lump sum (Month 6)", extra: 0, lump: 2000, month: 6 }
        ];

        return strategies.map(strategy => {
            const scenario = this.calculateEarlyPaymentScenario(strategy.extra, strategy.lump, strategy.month);
            return {
                ...strategy,
                totalMonths: scenario.totalMonths,
                totalInterest: scenario.totalInterest,
                totalPayment: scenario.totalPayment,
                monthsSaved: scenario.monthsSaved,
                interestSaved: baseScenario.totalInterest - scenario.totalInterest
            };
        });
    }

    // Get loan summary
    getLoanSummary() {
        const monthlyPayment = this.calculateMonthlyPayment();
        const totalPayment = monthlyPayment * this.termMonths;
        const totalInterest = totalPayment - this.principal;

        return {
            monthlyPayment: monthlyPayment.toFixed(3),
            totalPayment: totalPayment.toFixed(3),
            totalInterest: totalInterest.toFixed(3),
            effectiveRate: ((totalInterest / this.principal) * 100).toFixed(2)
        };
    }
}

// Enhanced loan calculation function for basic calculator
function calculateLoan() {
    try {
        const principal = parseFloat(document.getElementById('loan_amount').value);
        const annualRate = parseFloat(document.getElementById('interest_rate').value);
        const termMonths = parseInt(document.getElementById('loan_term').value);

        if (isNaN(principal) || isNaN(annualRate) || isNaN(termMonths) || 
            principal <= 0 || annualRate < 0 || termMonths <= 0) {
            throw new Error("Please enter valid numbers");
        }

        const loan = new LoanCalculator(principal, annualRate, termMonths);
        const summary = loan.getLoanSummary();

        // Find or create output div
        let outputDiv = document.querySelector('.loan-output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.className = 'loan-output output';
            document.querySelector('#loanForm').insertAdjacentElement('afterend', outputDiv);
        }

        outputDiv.innerHTML = `
            <h2>Loan Summary</h2>
            <div style="margin-top: 1em;">
                <p>Monthly Payment:<br><strong>KWD ${summary.monthlyPayment}</strong></p>
                <p class="salary-highlight">Total Payment:<br><strong>KWD ${summary.totalPayment}</strong></p>
                <p>Total Interest:<br><strong>KWD ${summary.totalInterest}</strong></p>
                <p>Effective Interest Rate:<br><strong>${summary.effectiveRate}%</strong></p>
            </div>
        `;
        outputDiv.style.display = 'block';

    } catch (error) {
        let outputDiv = document.querySelector('.loan-output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.className = 'loan-output output';
            document.querySelector('#loanForm').insertAdjacentElement('afterend', outputDiv);
        }
        outputDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        outputDiv.style.display = 'block';
    }
}

// Advanced loan calculation with early payment scenarios
function calculateAdvancedLoan() {
    try {
        const principal = parseFloat(document.getElementById('loan_amount').value);
        const annualRate = parseFloat(document.getElementById('interest_rate').value);
        const termMonths = parseInt(document.getElementById('loan_term').value);
        const extraPayment = parseFloat(document.getElementById('extra_payment').value) || 0;
        const lumpSum = parseFloat(document.getElementById('lump_sum').value) || 0;
        const lumpSumMonth = parseInt(document.getElementById('lump_sum_month').value) || 0;

        if (isNaN(principal) || isNaN(annualRate) || isNaN(termMonths) || 
            principal <= 0 || annualRate < 0 || termMonths <= 0) {
            throw new Error("Please enter valid numbers");
        }

        const loan = new LoanCalculator(principal, annualRate, termMonths);
        const baseSummary = loan.getLoanSummary();
        const earlyPaymentScenario = loan.calculateEarlyPaymentScenario(extraPayment, lumpSum, lumpSumMonth);
        const strategies = loan.calculatePaymentStrategies();

        // Find or create output div
        let outputDiv = document.querySelector('.advanced-loan-output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.className = 'advanced-loan-output output';
            document.querySelector('#advancedLoanForm').insertAdjacentElement('afterend', outputDiv);
        }

        let strategyHTML = '';
        strategies.forEach(strategy => {
            strategyHTML += `
                <tr>
                    <td>${strategy.name}</td>
                    <td>${strategy.totalMonths}</td>
                    <td>KWD ${strategy.totalInterest.toFixed(3)}</td>
                    <td>KWD ${strategy.interestSaved.toFixed(3)}</td>
                    <td>${strategy.monthsSaved}</td>
                </tr>
            `;
        });

        outputDiv.innerHTML = `
            <h2>Advanced Loan Analysis</h2>
            
            <h3>Current Scenario</h3>
            <div style="margin-top: 1em;">
                <p>Monthly Payment:<br><strong>KWD ${baseSummary.monthlyPayment}</strong></p>
                <p>Loan Term:<br><strong>${earlyPaymentScenario.totalMonths} months</strong></p>
                <p class="salary-highlight">Total Interest:<br><strong>KWD ${earlyPaymentScenario.totalInterest.toFixed(3)}</strong></p>
                <p>Months Saved:<br><strong>${earlyPaymentScenario.monthsSaved} months</strong></p>
            </div>

            <h3>Payment Strategy Comparison</h3>
            <div style="overflow-x: auto; margin-top: 1em;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Strategy</th>
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Months</th>
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Total Interest</th>
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Interest Saved</th>
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Months Saved</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${strategyHTML}
                    </tbody>
                </table>
            </div>
        `;
        outputDiv.style.display = 'block';

    } catch (error) {
        let outputDiv = document.querySelector('.advanced-loan-output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.className = 'advanced-loan-output output';
            document.querySelector('#advancedLoanForm').insertAdjacentElement('afterend', outputDiv);
        }
        outputDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        outputDiv.style.display = 'block';
    }
}

// Utility function to generate detailed amortization table
function generateAmortizationTable(principal, annualRate, termMonths, containerId) {
    const loan = new LoanCalculator(principal, annualRate, termMonths);
    const schedule = loan.generateAmortizationSchedule();
    
    let tableHTML = `
        <h3>Amortization Schedule</h3>
        <div style="max-height: 400px; overflow-y: auto; margin-top: 1em;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.8em;">
                <thead style="position: sticky; top: 0; background-color: #f5f5f5;">
                    <tr>
                        <th style="padding: 6px; border: 1px solid #ddd;">Month</th>
                        <th style="padding: 6px; border: 1px solid #ddd;">Payment</th>
                        <th style="padding: 6px; border: 1px solid #ddd;">Principal</th>
                        <th style="padding: 6px; border: 1px solid #ddd;">Interest</th>
                        <th style="padding: 6px; border: 1px solid #ddd;">Balance</th>
                    </tr>
                </thead>
                <tbody>
    `;

    schedule.forEach(row => {
        tableHTML += `
            <tr>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${row.month}</td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">KWD ${row.payment.toFixed(3)}</td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">KWD ${row.principal.toFixed(3)}</td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">KWD ${row.interest.toFixed(3)}</td>
                <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">KWD ${row.balance.toFixed(3)}</td>
            </tr>
        `;
    });

    tableHTML += `
                </tbody>
            </table>
        </div>
    `;

    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = tableHTML;
    }
}

// Initialize loan calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for basic loan form
    const basicLoanForm = document.getElementById('loanForm');
    if (basicLoanForm) {
        basicLoanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateLoan();
        });
    }
    
    // Add event listener for advanced loan form
    const advancedLoanForm = document.getElementById('advancedLoanForm');
    if (advancedLoanForm) {
        advancedLoanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateAdvancedLoan();
        });
    }

    // Add event listener for amortization table generation
    const showAmortizationBtn = document.getElementById('showAmortization');
    if (showAmortizationBtn) {
        showAmortizationBtn.addEventListener('click', function() {
            const principal = parseFloat(document.getElementById('loan_amount').value);
            const annualRate = parseFloat(document.getElementById('interest_rate').value);
            const termMonths = parseInt(document.getElementById('loan_term').value);
            
            if (!isNaN(principal) && !isNaN(annualRate) && !isNaN(termMonths)) {
                generateAmortizationTable(principal, annualRate, termMonths, 'amortizationTable');
            }
        });
    }
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LoanCalculator, calculateLoan, calculateAdvancedLoan };
}