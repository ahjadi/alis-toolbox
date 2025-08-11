// Enums
const MaritalStatus = {
    SINGLE: 'SINGLE',
    MARRIED: 'MARRIED'
};

const DegreeType = {
    MEDICAL_ENGINEERING_PHARMACY: 'MEDICAL_ENGINEERING_PHARMACY',
    OTHER_BACHELOR_1: 'OTHER_BACHELOR_1',
    OTHER_BACHELOR_2: 'OTHER_BACHELOR_2',
    DIPLOMA: 'DIPLOMA',
    HIGH_SCHOOL: 'HIGH_SCHOOL',
    MiddleSchool: 'MiddleSchool'
};

// Degree data
const DEGREE_DATA = {
    MEDICAL_ENGINEERING_PHARMACY: {
        social_allowance: { SINGLE: 190, MARRIED: 278 },
        additional: 220,
        degree_increment: 330,
        social_allowance_increase: { SINGLE: 50, MARRIED: 70 }
    },
    OTHER_BACHELOR_1: {
        social_allowance: { SINGLE: 190, MARRIED: 278 },
        additional: 220,
        degree_increment: 280,
        social_allowance_increase: { SINGLE: 50, MARRIED: 70 }
    },
    OTHER_BACHELOR_2: {
        social_allowance: { SINGLE: 190, MARRIED: 278 },
        additional: 220,
        degree_increment: 230,
        social_allowance_increase: { SINGLE: 50, MARRIED: 70 }
    },
    DIPLOMA: {
        social_allowance: { SINGLE: 169, MARRIED: 250 },
        additional: 220,
        degree_increment: 190,
        social_allowance_increase: { SINGLE: 50, MARRIED: 63 }
    },
    HIGH_SCHOOL: {
        social_allowance: { SINGLE: 161, MARRIED: 242 },
        additional: 220,
        degree_increment: 140,
        social_allowance_increase: { SINGLE: 50, MARRIED: 61 }
    },
    MiddleSchool: {
        social_allowance: { SINGLE: 161, MARRIED: 242 },
        additional: 220,
        degree_increment: 140,
        social_allowance_increase: { SINGLE: 50, MARRIED: 61 }
    }
};

class BaseSalary {
    constructor(baseSalary) {
        this.baseSalary = baseSalary;
    }

    calculateTax(taxRate = 10.5) {
        return Math.round(this.baseSalary * (taxRate / 100) * 1000) / 1000;
    }

    calculateBaseSalaryTaxed(taxRate = 10.5) {
        return Math.round((this.baseSalary - this.calculateTax(taxRate)) * 1000) / 1000;
    }
}

class WorkforceSupport extends BaseSalary {
    static CHILDREN_INCREMENT = 50; // Fixed at 50 KD per child, max 7 children

    constructor(baseSalary, maritalStatus, degreeType, numChildren) {
        super(baseSalary);
        
        if (!DEGREE_DATA[degreeType]) {
            throw new Error("Invalid degree type");
        }

        this.maritalStatus = maritalStatus;
        this.degreeType = degreeType;
        this.numChildren = Math.min(numChildren, 7); // Max 7 children allowed

        const degreeInfo = DEGREE_DATA[degreeType];
        this.socialAllowance = degreeInfo.social_allowance[maritalStatus];
        this.additional = degreeInfo.additional;
        this.degreeIncrement = degreeInfo.degree_increment;
        this.socialAllowanceIncrease = degreeInfo.social_allowance_increase[maritalStatus];
        this.childrenIncrement = this.numChildren * WorkforceSupport.CHILDREN_INCREMENT;
    }

    calculateTotalWFSAllowance() {
        return (
            this.socialAllowance +
            this.socialAllowanceIncrease +
            this.degreeIncrement +
            this.childrenIncrement +
            this.additional
        );
    }

    calculateTotalTaxableAllowance() {
        return this.socialAllowance + this.degreeIncrement;
    }

    calculateWfsTaxed(taxRate = 10.5) {
        return Math.round((this.calculateTotalWFSAllowance() - (this.calculateTotalTaxableAllowance() * (taxRate / 100))) * 1000) / 1000;
    }

    calculateTax(taxRate = 10.5) {
        const workforceTax = this.calculateTotalTaxableAllowance() * (taxRate / 100);
        const baseTax = super.calculateTax(taxRate);
        return Math.round((workforceTax + baseTax) * 1000) / 1000;
    }

    calculateTotalSalaryBeforeTax() {
        return this.baseSalary + this.calculateTotalWFSAllowance();
    }

    calculateTotalSalaryAfterTax(taxRate = 10.5) {
        return Math.round((this.calculateTotalSalaryBeforeTax() - this.calculateTax(taxRate)) * 1000) / 1000;
    }

    getSalarySummary(taxRate = 10.5) {
        const totalSalary = this.calculateTotalSalaryBeforeTax();
        const totalSalaryAfterTax = this.calculateTotalSalaryAfterTax(taxRate);
        const amountDeducted = totalSalary - totalSalaryAfterTax;
        
        // Calculate base salary after tax (only base salary tax, not WFS tax)
        const baseSalaryTax = this.baseSalary * (taxRate / 100);
        const baseSalaryAfterTax = Math.round((this.baseSalary - baseSalaryTax) * 1000) / 1000;
        
        const wfsAfterTax = this.calculateWfsTaxed(taxRate);

        return {
            totalSalary: totalSalary.toFixed(3),
            salaryAfterDeduction: totalSalaryAfterTax.toFixed(3),
            amountDeducted: amountDeducted.toFixed(3),
            baseSalaryAfterDeduction: baseSalaryAfterTax.toFixed(3),
            wfsAfterDeduction: wfsAfterTax.toFixed(3),
            baseSalaryBeforeTax: this.baseSalary.toFixed(3),
            wfsBeforeTax: this.calculateTotalWFSAllowance().toFixed(3)
        };
    }
}

// Basic calculator function
function calculateBasicSalary() {
    try {
        const baseSalary = parseFloat(document.getElementById('base_salary').value);
        const maritalStatus = document.getElementById('marital_status').value;
        const degreeType = document.getElementById('degree_type').value;
        const numChildren = parseInt(document.getElementById('num_children').value);

        if (isNaN(baseSalary) || isNaN(numChildren)) {
            throw new Error("Please enter valid numbers");
        }

        const workforceSupport = new WorkforceSupport(baseSalary, maritalStatus, degreeType, numChildren);
        const summary = workforceSupport.getSalarySummary();

        // Find or create output div
        let outputDiv = document.querySelector('.output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.className = 'output';
            document.querySelector('form').insertAdjacentElement('afterend', outputDiv);
        }

        outputDiv.innerHTML = `
            <div class="summary-card">
                <h2 class="summary-title">Salary Summary</h2>
                <div class="summary-row">
                    <span>Base Salary (Before Tax):</span>
                    <strong>KWD&nbsp;${summary.baseSalaryBeforeTax}</strong>
                </div>
                <div class="summary-row">
                    <span>WFS Allowance (Before Tax):</span>
                    <strong>KWD&nbsp;${summary.wfsBeforeTax}</strong>
                </div>
                <div class="summary-row">
                    <span>Total Salary (Before Tax):</span>
                    <strong>KWD&nbsp;${summary.totalSalary}</strong>
                </div>
                <div class="summary-row">
                    <span>Base Salary After Deduction:</span>
                    <strong>KWD&nbsp;${summary.baseSalaryAfterDeduction}</strong>
                </div>
                <div class="summary-row">
                    <span>WFS After Deduction:</span>
                    <strong>KWD&nbsp;${summary.wfsAfterDeduction}</strong>
                </div>
                <div class="summary-row highlight">
                    <span>Total Salary After Deduction:</span>
                    <strong>KWD&nbsp;${summary.salaryAfterDeduction}</strong>
                </div>
                <div class="summary-row final-highlight">
                    <span>Total Amount Deducted (PIFSS):</span>
                    <strong>-&nbsp;KWD&nbsp;${summary.amountDeducted}</strong>
                </div>
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

// Advanced calculator function
function calculateAdvancedSalary() {
    try {
        const baseSalary = parseFloat(document.getElementById('base_salary').value);
        const maritalStatus = document.getElementById('marital_status').value;
        const degreeType = document.getElementById('degree_type').value;
        const numChildren = parseInt(document.getElementById('num_children').value);
        const housingCompensation = parseFloat(document.getElementById('housing_compensation').value) || 0;
        const salaryAddition = parseFloat(document.getElementById('salary_addition').value) || 0;
        const salaryRemoval = parseFloat(document.getElementById('salary_removal').value) || 0;

        if (isNaN(baseSalary) || isNaN(numChildren)) {
            throw new Error("Please enter valid numbers");
        }

        const workforceSupport = new WorkforceSupport(baseSalary, maritalStatus, degreeType, numChildren);
        const summary = workforceSupport.getSalarySummary();
        
        // Calculate final salary with additional adjustments
        const baseNetSalary = parseFloat(summary.salaryAfterDeduction);
        const finalSalary = baseNetSalary + salaryAddition - salaryRemoval + housingCompensation;

        // Find or create output div
        let outputDiv = document.querySelector('.output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.className = 'output';
            document.querySelector('form').insertAdjacentElement('afterend', outputDiv);
        }

        outputDiv.innerHTML = `
            <div class="summary-card">
                <h2 class="summary-title">Advanced Salary Summary</h2>
                <div class="summary-row">
                    <span>Base Salary (Before Tax):</span>
                    <strong>KWD&nbsp;${summary.baseSalaryBeforeTax}</strong>
                </div>
                <div class="summary-row">
                    <span>WFS Allowance (Before Tax):</span>
                    <strong>KWD&nbsp;${summary.wfsBeforeTax}</strong>
                </div>
                <div class="summary-row">
                    <span>Total Salary (Before Tax):</span>
                    <strong>KWD&nbsp;${summary.totalSalary}</strong>
                </div>
                <div class="summary-row">
                    <span>Base Salary After Deduction:</span>
                    <strong>KWD&nbsp;${summary.baseSalaryAfterDeduction}</strong>
                </div>
                <div class="summary-row">
                    <span>WFS After Deduction:</span>
                    <strong>KWD&nbsp;${summary.wfsAfterDeduction}</strong>
                </div>
                <div class="summary-row">
                    <span>Total Salary After Deduction:</span>
                    <strong>KWD&nbsp;${summary.salaryAfterDeduction}</strong>
                </div>
                <div class="summary-row">
                    <span>Total Amount Deducted (PIFSS):</span>
                    <strong>-&nbsp;KWD&nbsp;${summary.amountDeducted}</strong>
                </div>
                ${housingCompensation > 0 ? `
                <div class="summary-row">
                    <span>Housing Compensation:</span>
                    <strong>+&nbsp;KWD&nbsp;${housingCompensation.toFixed(3)}</strong>
                </div>` : ''}
                ${salaryAddition > 0 ? `
                <div class="summary-row">
                    <span>Salary Addition:</span>
                    <strong>+&nbsp;KWD&nbsp;${salaryAddition.toFixed(3)}</strong>
                </div>` : ''}
                ${salaryRemoval > 0 ? `
                <div class="summary-row">
                    <span>Salary Removal:</span>
                    <strong style="color: var(--accent-color);">-&nbsp;KWD&nbsp;${salaryRemoval.toFixed(3)}</strong>
                </div>` : ''}
                <div class="summary-row final-highlight">
                    <span>Final Total Salary:</span>
                    <strong>KWD&nbsp;${finalSalary.toFixed(3)}</strong>
                </div>
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
// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize marital status toggle
    const maritalToggle = document.getElementById('marital_status_toggle');
    if (maritalToggle) {
        maritalToggle.addEventListener('change', function() {
            const maritalStatusInput = document.getElementById('marital_status');
            maritalStatusInput.value = this.checked ? 'MARRIED' : 'SINGLE';
        });
    }

    // Initialize children buttons
    const childButtons = document.querySelectorAll('.child-button');
    childButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'selected' class from all buttons
            childButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add 'selected' class to clicked button
            this.classList.add('selected');
            
            // Update hidden input value
            const numChildren = this.getAttribute('data-value');
            document.getElementById('num_children').value = numChildren;
        });
    });

    // Set default selected button (0 children)
    const defaultButton = document.querySelector('.child-button[data-value="0"]');
    if (defaultButton) {
        defaultButton.classList.add('selected');
    }

    // Add event listener to form if it exists
    const basicForm = document.getElementById('salaryForm');
    const advancedForm = document.getElementById('advancedSalaryForm');
    
    if (basicForm) {
        basicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateBasicSalary();
        });
    }
    
    if (advancedForm) {
        advancedForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateAdvancedSalary();
        });
    }
});