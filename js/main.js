import { calculateSalary } from './salaryCalculator.js';
import { displayError, displaySalarySummary } from './salaryUI.js';

document.addEventListener('DOMContentLoaded', function () {

    const toggleBtn =
        document.getElementById('toggleAdvanced');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {

            const advancedOptions =
                document.getElementById('advancedOptions');

            if (!advancedOptions) {
                return;
            }

            const isHidden =
                getComputedStyle(advancedOptions).display === 'none';

advancedOptions.style.display =
    isHidden ? 'block' : 'none';

this.textContent =
    isHidden
        ? 'Hide Advanced Options'
        : 'Show Advanced Options';

if (isHidden) {
    setTimeout(() => {
        advancedOptions.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}
        });
    }


    const maritalToggle =
        document.getElementById('marital_status_toggle');

    if (maritalToggle) {
        maritalToggle.addEventListener('change', function () {

            const maritalStatusInput =
                document.getElementById('marital_status');

            if (maritalStatusInput) {
                maritalStatusInput.value =
                    this.checked ? 'MARRIED' : 'SINGLE';
            }
        });
    }


    const childButtons =
        document.querySelectorAll('.child-button');

    childButtons.forEach(button => {
        button.addEventListener('click', function () {

            childButtons.forEach(btn =>
                btn.classList.remove('selected')
            );

            this.classList.add('selected');

            const numChildren =
                this.getAttribute('data-value');

            document.getElementById('num_children').value =
                numChildren;
        });
    });


    const defaultButton =
        document.querySelector(
            '.child-button[data-value="0"]'
        );

    if (defaultButton) {
        defaultButton.classList.add('selected');
    }


    const salaryForm =
        document.getElementById('salaryForm');

    if (salaryForm) {
        salaryForm.addEventListener('submit', function (e) {

            e.preventDefault();

            try {

                const baseSalary =
                    parseFloat(
                        document.getElementById('base_salary').value
                    );

                const maritalStatus =
                    document.getElementById('marital_status').value;

                const degreeType =
                    document.getElementById('degree_type').value;

                const numChildren =
                    parseInt(
                        document.getElementById('num_children').value
                    );

                const postGradStatus =
                    document.getElementById('post_grad_status').value;


                const housingCompensation =
                    parseFloat(
                        document.getElementById(
                            'housing_compensation'
                        ).value
                    ) || 0;

                const salaryAddition =
                    parseFloat(
                        document.getElementById(
                            'salary_addition'
                        ).value
                    ) || 0;

                const salaryRemoval =
                    parseFloat(
                        document.getElementById(
                            'salary_removal'
                        ).value
                    ) || 0;


                const result =
                    calculateSalary({
                        baseSalary,
                        maritalStatus,
                        degreeType,
                        numChildren,
                        postGradStatus,
                        housingCompensation,
                        salaryAddition,
                        salaryRemoval
                    });


                displaySalarySummary(result);

            } catch (error) {
                displayError(error);
            }
        });
    }
});