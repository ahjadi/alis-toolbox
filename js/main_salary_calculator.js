import { calculateAdvancedSalary } from './salary_helper/advanced_salary_logic.js';
import { calculateBasicSalary } from './salary_helper/basic_salary_logic.js';

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Toggle Advanced Options
    const toggleBtn = document.getElementById('toggleAdvanced');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            const advancedOptions = document.getElementById('advancedOptions');
            const isHidden = advancedOptions.style.display === 'none';
            advancedOptions.style.display = isHidden ? 'block' : 'none';
            this.textContent = isHidden ? 'Hide Advanced Options' : 'Show Advanced Options';
        });
    }

    // Initialize marital status toggle
    const maritalToggle = document.getElementById('marital_status_toggle');
    if (maritalToggle) {
        maritalToggle.addEventListener('change', function () {
            const maritalStatusInput = document.getElementById('marital_status');
            maritalStatusInput.value = this.checked ? 'MARRIED' : 'SINGLE';
        });
    }


    // Initialize children buttons
    const childButtons = document.querySelectorAll('.child-button');
    childButtons.forEach(button => {
        button.addEventListener('click', function () {
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

    // Add event listener to salary form (handles both basic and advanced)
    const salaryForm = document.getElementById('salaryForm');
    if (salaryForm) {
        salaryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Check if advanced options are being used
            const housingCompensation = parseFloat(document.getElementById('housing_compensation').value) || 0;
            const salaryAddition = parseFloat(document.getElementById('salary_addition').value) || 0;
            const salaryRemoval = parseFloat(document.getElementById('salary_removal').value) || 0;

            // If any advanced options are set, use advanced calculation
            if (housingCompensation > 0 || salaryAddition > 0 || salaryRemoval > 0) {
                calculateAdvancedSalary();
            } else {
                calculateBasicSalary();
            }
        });
    }
});