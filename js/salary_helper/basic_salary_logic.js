import { WorkforceSupport } from './WorkforceSupport.js';

export function calculateBasicSalary() {
    try {
        const baseSalary = parseFloat(document.getElementById('base_salary').value);
        const maritalStatus = document.getElementById('marital_status').value;
        const degreeType = document.getElementById('degree_type').value;
        const numChildren = parseInt(document.getElementById('num_children').value);
        const postGradStatus = document.getElementById('post_grad_status').value;

        if (isNaN(baseSalary) || isNaN(numChildren)) {
            throw new Error("Please enter valid numbers");
        }

        const workforceSupport = new WorkforceSupport(baseSalary, maritalStatus, degreeType, numChildren, postGradStatus);
        const summary = workforceSupport.getSalarySummary();

        // Find or create output div
        let outputDiv = document.querySelector('.output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.className = 'output';
            document.querySelector('form').insertAdjacentElement('afterend', outputDiv);
        }

        const sections = [
            {
                title: 'Before Tax',
                rows: [
                    { label: 'Base Salary', value: summary.baseSalaryBeforeTax },
                    { label: 'WFS Allowance', value: summary.wfsBeforeTax },
                    { label: 'Total Salary', value: summary.totalSalary, highlightClass: 'highlightBeforeTax' }
                ]
            },
            {
                title: 'After PIFSS Tax Deductions',
                rows: [
                    { label: 'Base Salary', value: summary.baseSalaryAfterDeduction },
                    { label: 'WFS Allowance', value: summary.wfsAfterDeduction },
                    { label: 'Total Deducted', value: summary.amountDeducted, negative: true, highlightClass: 'final-highlightDecuctions' },
                    { label: 'Total Salary', value: summary.salaryAfterDeduction, highlightClass: 'final-highlightAfterTax' }
                ]
            }
        ];

        outputDiv.innerHTML = `
            <div class="summary-card">
                <h2 class="summary-title">Salary Summary</h2>
                ${sections.map(section => `
                    <div class="section-group">
                        <h3 class="section-title">${section.title}</h3>
                        ${section.rows.map(row => `
                            <div class="summary-row ${row.highlightClass || ''}">
                                <span>${row.label}:</span>
                                <strong>${row.negative ? '- ' : ''}KWD&nbsp;${row.value}</strong>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
        outputDiv.style.display = 'block';

        // Smooth scroll to results on mobile (iPhone optimization)
        setTimeout(() => {
            outputDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }, 100);

    } catch (error) {
        let outputDiv = document.querySelector('.output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.className = 'output';
            document.querySelector('form').insertAdjacentElement('afterend', outputDiv);
        }

        outputDiv.innerHTML = `
            <div class="summary-card">
                <div class="summary-row" style="background-color: #ffebee; border: 1px solid var(--accent-color); border-radius: var(--radius-md); padding: var(--spacing-md);">
                    <span style="color: var(--accent-color); font-weight: 600;">Error: ${error.message}</span>
                </div>
            </div>
        `;

        outputDiv.style.display = 'block';

        // Scroll to error message on mobile
        setTimeout(() => {
            outputDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    }
}
