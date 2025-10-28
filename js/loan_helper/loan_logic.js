import { LoanCalculator } from './LoanCalculator.js';

export function calculateLoanCombined() {
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
            <h2 class = "special-for-loan">Loan Summary</h2>
<div style="margin-top: 1em;">
    <p class = "special-for-loan">Monthly Payment:<br><strong>KWD ${summary.monthlyPayment}</strong></p>
    <p class = "special-for-loan">Total Payment:<br><strong>KWD ${summary.totalPayment}</strong></p>
    <p class = "special-for-loan2">Total Interest:<br><strong style="color: var(--accent-color);">KWD ${summary.totalInterest}</strong></p>
    <p class = "special-for-loan2">Effective Interest Rate:<br><strong style="color: var(--accent-color);">${summary.effectiveRate}%</strong></p>
</div>
        `;
        outputDiv.style.display = 'block';

        outputDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        let outputDiv = document.querySelector('.loan-output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.className = 'loan-output output';
            document.querySelector('#loanForm').insertAdjacentElement('afterend', outputDiv);
        }
        outputDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        outputDiv.style.display = 'block';

        outputDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

export function calculateAdvancedLoanCombined() {
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

        // Find the best strategy
        const bestStrategy = strategies.reduce((best, current) => 
            current.interestSaved > best.interestSaved ? current : best
        );

        // Find or create output div - use same div as basic
        let outputDiv = document.querySelector('.loan-output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.className = 'loan-output output';
            document.querySelector('#loanForm').insertAdjacentElement('afterend', outputDiv);
        }

        // Generate strategy cards HTML
        let strategyCardsHTML = '';
        strategies.forEach(strategy => {
            const isStandard = strategy.extra === 0 && strategy.lump === 0;
            const isBest = strategy.name === bestStrategy.name && !isStandard;
            
            let cardClass = 'strategy-card';
            if (isStandard) cardClass += ' standard';
            if (isBest) cardClass += ' best-savings';

            strategyCardsHTML += `
                <div class="${cardClass}">
                    <div class="strategy-header">
                        <span>${strategy.name}</span>
                        ${isStandard ? '<span class="strategy-badge" style="background: #666;">Current</span>' : ''}
                        ${isBest ? '<span class="strategy-badge">Best Savings</span>' : ''}
                    </div>
                    <div class="strategy-metrics">
                        <div class="metric">
                            <span class="metric-label">Duration</span>
                            <span class="metric-value">${strategy.totalMonths} months</span>
                        </div>
                        ${!isStandard ? `
                            <div class="metric">
                                <span class="metric-label">Interest Saved</span>
                                <span class="metric-value highlight">KWD ${strategy.interestSaved.toFixed(3)}</span>
                            </div>
                        ` : `
                            <div class="metric">
                                <span class="metric-label">Total Interest</span>
                                <span class="metric-value">KWD ${strategy.totalInterest.toFixed(3)}</span>
                            </div>
                        `}
                        ${!isStandard ? `
                            <div class="metric">
                                <span class="metric-label">Time Saved</span>
                                <span class="metric-value highlight">${strategy.monthsSaved} months</span>
                            </div>
                        ` : ''}
                        ${strategy.extra > 0 ? `
                            <div class="metric full-width">
                                <span class="metric-label">Monthly Payment</span>
                                <span class="metric-value">KWD ${parseFloat(baseSummary.monthlyPayment).toFixed(3)} + ${strategy.extra} = <strong>KWD ${(parseFloat(baseSummary.monthlyPayment) + strategy.extra).toFixed(3)}</strong></span>
                            </div>
                        ` : ''}
                        ${strategy.lump > 0 ? `
                            <div class="metric full-width">
                                <span class="metric-label">One-time Payment</span>
                                <span class="metric-value">KWD ${strategy.lump.toFixed(3)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        // Create monthly payment display for current scenario
        let monthlyPaymentDisplay = '';
        if (extraPayment > 0) {
            monthlyPaymentDisplay = `<p>Monthly Payment:<br><strong>KWD ${baseSummary.monthlyPayment} + ${extraPayment.toFixed(3)} = KWD ${(parseFloat(baseSummary.monthlyPayment) + extraPayment).toFixed(3)}</strong></p>`;
        } else {
            monthlyPaymentDisplay = `<p>Monthly Payment:<br><strong>KWD ${baseSummary.monthlyPayment}</strong></p>`;
        }

        outputDiv.innerHTML = `
            <h2>Advanced Loan Analysis</h2>
            
            <h3>Current Scenario</h3>
            <div style="margin-top: 1em;">
                ${monthlyPaymentDisplay}
                <p>Loan Term:<br><strong>${earlyPaymentScenario.totalMonths} months</strong></p>
                <p class="salary-highlight">Total Interest:<br><strong>KWD ${earlyPaymentScenario.totalInterest.toFixed(3)}</strong></p>
                <p>Months Saved:<br><strong>${earlyPaymentScenario.monthsSaved} months</strong></p>
                ${lumpSum > 0 ? `<p>Lump Sum Payment:<br><strong>KWD ${lumpSum.toFixed(3)} at month ${lumpSumMonth}</strong></p>` : ''}
            </div>

            <h3>Payment Strategy Comparison</h3>
            
            <!-- Quick Summary -->
            ${bestStrategy.interestSaved > 0 ? `
                <div class="comparison-summary">
                    <h4>Best Strategy: ${bestStrategy.name}</h4>
                    <p>Save KWD ${bestStrategy.interestSaved.toFixed(3)} in interest and pay off ${bestStrategy.monthsSaved} months early!</p>
                </div>
            ` : ''}

            <!-- Strategy Cards -->
            <div class="strategy-container">
                ${strategyCardsHTML}
            </div>
        `;
        outputDiv.style.display = 'block';

        outputDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        let outputDiv = document.querySelector('.loan-output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.className = 'loan-output output';
            document.querySelector('#loanForm').insertAdjacentElement('afterend', outputDiv);
        }
        outputDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        outputDiv.style.display = 'block';
        outputDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

export function generateAmortizationTable(principal, annualRate, termMonths, containerId) {
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