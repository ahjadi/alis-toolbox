export function displaySalarySummary(summary) {
    let outputDiv = document.querySelector('.output');

    if (!outputDiv) {
        outputDiv = document.createElement('div');
        outputDiv.className = 'output';

        document
            .querySelector('form')
            .insertAdjacentElement('afterend', outputDiv);
    }

    const breakdownSections = [
        {
            title: 'Before PIFSS Deductions',
            rows: [
                {
                    label: 'Base Salary',
                    value: summary.baseSalary.toFixed(3)
                },
                {
                    label: 'PIFSS Basic-Insurable WFS',
                    value: summary.wfs.pifssInsurable.toFixed(3)
                },
                {
                    label: 'Other WFS Allowance',
                    value: summary.wfs.nonPifss.toFixed(3)
                },
                {
                    label: 'Total WFS Allowance',
                    value: summary.wfs.total.toFixed(3)
                },
                {
                    label: 'Gross Salary',
                    value: summary.grossSalary.toFixed(3),
                    highlightClass: 'highlightBeforeTax'
                }
            ]
        },

        {
            title: 'PIFSS Deductions',
            rows: [
                {
                    label: 'Basic Insurance Salary',
                    value: summary.pifss.basicInsuranceSalary.toFixed(3)
                },
                {
                    label: 'Basic Insurance Contribution (5%)',
                    value: summary.pifss.basicContribution.toFixed(3),
                    negative: true
                },
                {
                    label: 'Supplementary Insurance Salary',
                    value: summary.pifss.supplementaryInsuranceSalary.toFixed(3)
                },
                {
                    label: 'Supplementary Contribution (5%)',
                    value: summary.pifss.supplementaryContribution.toFixed(3),
                    negative: true
                },
                {
                    label: 'Total PIFSS Deduction',
                    value: summary.pifss.total.toFixed(3),
                    negative: true,
                    highlightClass: 'final-highlightDecuctions'
                }
            ]
        },

        {
            title: 'After PIFSS Deductions',
            rows: [
                {
                    label: 'Gross Salary',
                    value: summary.grossSalary.toFixed(3)
                },
                {
                    label: 'PIFSS Deduction',
                    value: summary.pifss.total.toFixed(3),
                    negative: true
                },
                {
                    label: 'Net Salary',
                    value: summary.netSalary.toFixed(3),
                    highlightClass: 'final-highlightAfterTax'
                }
            ]
        }
    ];

    const modifications = [
        ...(summary.housingCompensation > 0
            ? [{
                label: 'Housing',
                value: summary.housingCompensation.toFixed(3),
                positive: true
            }]
            : []),

        ...(summary.salaryAddition > 0
            ? [{
                label: 'Salary Addition',
                value: summary.salaryAddition.toFixed(3),
                positive: true
            }]
            : []),

        ...(summary.salaryRemoval > 0
            ? [{
                label: 'Salary Removal',
                value: summary.salaryRemoval.toFixed(3),
                negative: true,
                redText: true
            }]
            : [])
    ];

    outputDiv.innerHTML = `
        <div class="summary-card">
            <h2 class="summary-title">Salary Summary</h2>

            <div class="net-income-card">
                <div class="net-income-label">
                    NET INCOME
                </div>

                <div class="net-income-value">
                    KWD&nbsp;${summary.finalSalary.toFixed(3)}
                </div>
            </div>

            <div class="section-group">

                <div class="summary-row">
                    <span>Gross Salary:</span>
                    <strong>
                        KWD&nbsp;${summary.grossSalary.toFixed(3)}
                    </strong>
                </div>

                <div class="summary-row">
                    <span>PIFSS Deduction:</span>
                    <strong>
                        - KWD&nbsp;${summary.pifss.total.toFixed(3)}
                    </strong>
                </div>

                ${modifications.map(row => `
                    <div class="summary-row">
                        <span>${row.label}:</span>

                        <strong ${row.redText
                            ? 'style="color: var(--accent-color);"'
                            : ''
                        }>
                            ${row.positive ? '+ ' : row.negative ? '- ' : ''}
                            KWD&nbsp;${row.value}
                        </strong>
                    </div>
                `).join('')}

            </div>

            <button
                type="button"
                id="toggleSalaryBreakdown"
                style="
                    background-color: transparent;
                    color: var(--primary-color);
                    border: 1px solid var(--border-color);
                    margin-top: var(--spacing-md);
                "
            >
                Show Full Breakdown
            </button>

            <div
                id="salaryBreakdown"
                style="display: none;"
            >
                ${breakdownSections.map(section => `
                    <div class="section-group">

                        <h3 class="section-title">
                            ${section.title}
                        </h3>

                        ${section.rows.map(row => `
                            <div class="summary-row ${row.highlightClass || ''}">
                                <span style="white-space: nowrap;">
                                    ${row.label}:
                                </span>

                                <strong>
                                    ${row.positive ? '+ ' : row.negative ? '- ' : ''}
                                    KWD&nbsp;${row.value}
                                </strong>
                            </div>
                        `).join('')}

                    </div>
                `).join('')}
            </div>
        </div>
    `;

    outputDiv.style.display = 'block';

    const toggleBreakdown =
        document.getElementById('toggleSalaryBreakdown');

    const salaryBreakdown =
        document.getElementById('salaryBreakdown');

    if (toggleBreakdown && salaryBreakdown) {
        toggleBreakdown.addEventListener('click', function () {

            const isHidden =
                salaryBreakdown.style.display === 'none';

            salaryBreakdown.style.display =
                isHidden ? 'block' : 'none';

            this.textContent =
                isHidden
                    ? 'Hide Full Breakdown'
                    : 'Show Full Breakdown';

            if (isHidden) {
                setTimeout(() => {
                    salaryBreakdown.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        });
    }

    setTimeout(() => {
        outputDiv.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        });
    }, 100);
}

export function displayError(error) {
    let outputDiv = document.querySelector('.output');

    if (!outputDiv) {
        outputDiv = document.createElement('div');
        outputDiv.className = 'output';

        document
            .querySelector('form')
            .insertAdjacentElement('afterend', outputDiv);
    }

    outputDiv.innerHTML = `
        <div class="summary-card">
            <div
                class="summary-row"
                style="
                    background-color: #ffebee;
                    border: 1px solid var(--accent-color);
                    border-radius: var(--radius-md);
                    padding: var(--spacing-md);
                "
            >
                <span
                    style="
                        color: var(--accent-color);
                        font-weight: 600;
                    "
                >
                    Error: ${error.message}
                </span>
            </div>
        </div>
    `;

    outputDiv.style.display = 'block';

    setTimeout(() => {
        outputDiv.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, 100);
}