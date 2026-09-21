export class BaseSalary {
    constructor(baseSalary) {
        this.baseSalary = baseSalary;
    }

    /*
     * PIFSS private-sector employee contribution rates
     */
    static BASIC_RATE = 0.05;                 // 5%
    static SUPPLEMENTARY_RATE = 0.05;         // 5%
    static PENSION_INCREASE_RATE = 0.025;     // 2.5%
    static FINANCIAL_REMUNERATION_RATE = 0.025; // 2.5%
    static UNEMPLOYMENT_RATE = 0.005;         // 0.5%

    /*
     * PIFSS salary ceilings
     */
    static BASIC_CEILING = 1500;
    static SUPPLEMENTARY_CEILING = 1250;
    static TOTAL_CEILING = 2750;

    /*
     * Round to 3 decimal places.
     */
    round(value) {
        return Math.round((value + Number.EPSILON) * 1000) / 1000;
    }

    /*
     * The employer salary itself is part of the PIFSS calculation.
     */
    calculateEmployerSalary() {
        return this.baseSalary;
    }

    /*
     * Basic insurance salary:
     *
     * Maximum = KD 1,500
     *
     * The WorkforceSupport class supplies the applicable
     * WFS components that PIFSS treats as part of this base.
     */
    calculateBasicInsuranceSalary(basicInsuranceAllowances = 0) {
        return Math.min(
            this.calculateEmployerSalary() + basicInsuranceAllowances,
            BaseSalary.BASIC_CEILING
        );
    }

    /*
     * Supplementary insurance salary:
     *
     * Amount above KD 1,500, with a maximum supplementary
     * salary of KD 1,250.
     */
    calculateSupplementaryInsuranceSalary(totalInsuranceSalary) {
        const amountAboveBasicCeiling = Math.max(
            totalInsuranceSalary - BaseSalary.BASIC_CEILING,
            0
        );

        return Math.min(
            amountAboveBasicCeiling,
            BaseSalary.SUPPLEMENTARY_CEILING
        );
    }

    /*
     * Basic insurance contribution: 5%
     */
    calculateBasicInsuranceContribution(basicInsuranceSalary) {
        return this.round(
            basicInsuranceSalary * BaseSalary.BASIC_RATE
        );
    }

    /*
     * Supplementary insurance contribution: 5%
     */
    calculateSupplementaryInsuranceContribution(supplementaryInsuranceSalary) {
        return this.round(
            supplementaryInsuranceSalary * BaseSalary.SUPPLEMENTARY_RATE
        );
    }

    /*
     * Pension increase contribution: 2.5%
     *
     * Applied to basic + supplementary insurance salary,
     * up to KD 2,750.
     */
    calculatePensionIncreaseContribution(
        basicInsuranceSalary,
        supplementaryInsuranceSalary
    ) {
        const pensionIncreaseBase = Math.min(
            basicInsuranceSalary + supplementaryInsuranceSalary,
            BaseSalary.TOTAL_CEILING
        );

        return this.round(
            pensionIncreaseBase * BaseSalary.PENSION_INCREASE_RATE
        );
    }

    /*
     * Financial remuneration contribution: 2.5%
     *
     * Applied to the basic insurance salary,
     * up to KD 1,500.
     */
    calculateFinancialRemunerationContribution(basicInsuranceSalary) {
        const financialRemunerationBase = Math.min(
            basicInsuranceSalary,
            BaseSalary.BASIC_CEILING
        );

        return this.round(
            financialRemunerationBase *
            BaseSalary.FINANCIAL_REMUNERATION_RATE
        );
    }

    /*
     * Unemployment insurance contribution: 0.5%
     *
     * Applied to basic + supplementary insurance salary,
     * up to KD 2,750.
     */
    calculateUnemploymentContribution(
        basicInsuranceSalary,
        supplementaryInsuranceSalary
    ) {
        const unemploymentBase = Math.min(
            basicInsuranceSalary + supplementaryInsuranceSalary,
            BaseSalary.TOTAL_CEILING
        );

        return this.round(
            unemploymentBase * BaseSalary.UNEMPLOYMENT_RATE
        );
    }

    /*
     * Total PIFSS employee deduction.
     */
    calculatePIFSS(
        basicInsuranceAllowances = 0,
        additionalInsuranceAllowances = 0
    ) {
        const basicInsuranceSalary =
            this.calculateBasicInsuranceSalary(basicInsuranceAllowances);

        const totalInsuranceSalary =
            this.calculateEmployerSalary() +
            basicInsuranceAllowances +
            additionalInsuranceAllowances;

        const supplementaryInsuranceSalary =
            this.calculateSupplementaryInsuranceSalary(
                totalInsuranceSalary
            );

        const basicContribution =
            this.calculateBasicInsuranceContribution(
                basicInsuranceSalary
            );

        const supplementaryContribution =
            this.calculateSupplementaryInsuranceContribution(
                supplementaryInsuranceSalary
            );

        const pensionIncreaseContribution =
            this.calculatePensionIncreaseContribution(
                basicInsuranceSalary,
                supplementaryInsuranceSalary
            );

        const financialRemunerationContribution =
            this.calculateFinancialRemunerationContribution(
                basicInsuranceSalary
            );

        const unemploymentContribution =
            this.calculateUnemploymentContribution(
                basicInsuranceSalary,
                supplementaryInsuranceSalary
            );

        return {
            basicInsuranceSalary: this.round(basicInsuranceSalary),
            supplementaryInsuranceSalary: this.round(
                supplementaryInsuranceSalary
            ),
            basicContribution,
            supplementaryContribution,
            pensionIncreaseContribution,
            financialRemunerationContribution,
            unemploymentContribution,

            total: this.round(
                basicContribution +
                supplementaryContribution +
                pensionIncreaseContribution +
                financialRemunerationContribution +
                unemploymentContribution
            )
        };
    }

    /*
     * Kept for compatibility with the existing calculator.
     *
     * Previously this represented a flat 10.5% deduction.
     * It now represents the actual PIFSS calculation.
     */
    calculateTax() {
        return this.calculatePIFSS().total;
    }
}