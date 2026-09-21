import { BaseSalary } from './BaseSalary.js';
import { DEGREE_DATA, PostGradStatus } from './salary_data.js';

export class WorkforceSupport extends BaseSalary {
    static CHILDREN_INCREMENT = 50;
    static MAX_CHILDREN = 7;
    static SALARY_CAP = 1250;

    constructor(
        baseSalary,
        maritalStatus,
        degreeType,
        numChildren,
        postGradStatus
    ) {
        super(baseSalary);

        if (!DEGREE_DATA[degreeType]) {
            throw new Error("Invalid degree type");
        }

        this.maritalStatus = maritalStatus;
        this.degreeType = degreeType;

        this.numChildren = Math.min(
            Math.max(numChildren, 0),
            WorkforceSupport.MAX_CHILDREN
        );

        this.postGradStatus = postGradStatus;

        this.postGradIncrease =
            PostGradStatus[this.postGradStatus] || 0;

        const degreeInfo = DEGREE_DATA[degreeType];

        this.socialAllowance =
            degreeInfo.social_allowance[maritalStatus];

        this.additionalBase =
            degreeInfo.additional;

        this.degreeIncrement =
            degreeInfo.degree_increment;

        this.socialAllowanceIncrease =
            degreeInfo.social_allowance_increase[maritalStatus];

        this.childrenIncrement =
            this.numChildren *
            WorkforceSupport.CHILDREN_INCREMENT;

        this.additional =
            this.calculateAdjustedAdditional();
    }

    round(value) {
        return Math.round(
            (value + Number.EPSILON) * 1000
        ) / 1000;
    }

    calculateAdjustedAdditional() {
        if (this.baseSalary >= WorkforceSupport.SALARY_CAP) {
            return {
                cost_of_living: this.additionalBase.cost_of_living,
                bonus: this.additionalBase.bonus,
                increment: 0
            };
        }

        const remainingToCap =
            WorkforceSupport.SALARY_CAP -
            this.baseSalary;

        const adjustedIncrement =
            Math.min(
                this.additionalBase.increment,
                remainingToCap
            );

        return {
            cost_of_living: this.additionalBase.cost_of_living,
            bonus: this.additionalBase.bonus,
            increment: adjustedIncrement
        };
    }

    calculateTotalWFSAllowance() {
        const additionalTotal =
            this.additional.cost_of_living +
            this.additional.bonus +
            this.additional.increment;

        return this.round(
            this.socialAllowance +
            this.socialAllowanceIncrease +
            this.degreeIncrement +
            this.childrenIncrement +
            this.postGradIncrease +
            additionalTotal
        );
    }

    /*
     * WFS components included in the PIFSS basic insurance salary:
     *
     * - Social allowance
     * - Social allowance increase
     * - Children's allowance
     * - Educational qualification allowance
     * - Postgraduate educational qualification allowance
     *
     * The BaseSalary class applies the KD 1,500
     * basic-insurance ceiling.
     */
calculatePIFSSBasicInsuranceAllowances() {
    return this.round(
        this.socialAllowance +
        this.childrenIncrement +
        this.degreeIncrement +
        this.postGradIncrease
    );
}

    /*
     * WFS components outside the PIFSS basic-insurance salary.
     *
     * This is the WFS additional package:
     * - KD 120 cost of living
     * - KD 50 bonus
     * - KD 50 increment, subject to the KD 1,250 rule
     */
    calculateNonPifssWfsAllowance() {
        return this.round(
            this.additional.cost_of_living +
            this.additional.bonus +
            this.additional.increment
        );
    }

    /*
     * No separate additional insurance allowance is currently
     * being classified outside the basic insurance salary.
     */
    calculatePIFSSAdditionalInsuranceAllowances() {
        return 0;
    }

    calculatePIFSSDetails() {
        const basicInsuranceAllowances =
            this.calculatePIFSSBasicInsuranceAllowances();

        const additionalInsuranceAllowances =
            this.calculatePIFSSAdditionalInsuranceAllowances();

        return this.calculatePIFSS(
            basicInsuranceAllowances,
            additionalInsuranceAllowances
        );
    }

    calculateTax() {
        return this.calculatePIFSSDetails().total;
    }

    /*
     * Kept for compatibility with existing code.
     */
    calculateWfsTaxed() {
        const totalWFS =
            this.calculateTotalWFSAllowance();

        const totalPIFSS =
            this.calculateTax();

        const totalSalary =
            this.calculateTotalSalaryBeforeTax();

        if (totalSalary <= 0) {
            return this.round(totalWFS);
        }

        const wfsShare =
            totalWFS / totalSalary;

        const wfsDeduction =
            totalPIFSS * wfsShare;

        return this.round(
            totalWFS - wfsDeduction
        );
    }

    calculateTotalSalaryBeforeTax() {
        return this.round(
            this.baseSalary +
            this.calculateTotalWFSAllowance()
        );
    }

    calculateTotalSalaryAfterTax() {
        return this.round(
            this.calculateTotalSalaryBeforeTax() -
            this.calculateTax()
        );
    }

    getSalarySummary() {
        const totalSalary =
            this.calculateTotalSalaryBeforeTax();

        const pifss =
            this.calculatePIFSSDetails();

        const totalSalaryAfterTax =
            this.calculateTotalSalaryAfterTax();

        const amountDeducted =
            totalSalary -
            totalSalaryAfterTax;

        return {
            totalSalary:
                totalSalary.toFixed(3),

            salaryAfterDeduction:
                totalSalaryAfterTax.toFixed(3),

            amountDeducted:
                amountDeducted.toFixed(3),

            baseSalaryBeforeTax:
                this.baseSalary.toFixed(3),

            wfsBeforeTax:
                this.calculateTotalWFSAllowance().toFixed(3),

            pifssBasicInsuranceAllowances:
                this.calculatePIFSSBasicInsuranceAllowances().toFixed(3),

            nonPifssWfsAllowance:
                this.calculateNonPifssWfsAllowance().toFixed(3),

            pifssBasicInsuranceSalary:
                pifss.basicInsuranceSalary.toFixed(3),

            pifssSupplementaryInsuranceSalary:
                pifss.supplementaryInsuranceSalary.toFixed(3),

            pifssBasicContribution:
                pifss.basicContribution.toFixed(3),

            pifssSupplementaryContribution:
                pifss.supplementaryContribution.toFixed(3),

            pifssPensionIncrease:
                pifss.pensionIncreaseContribution.toFixed(3),

            pifssFinancialRemuneration:
                pifss.financialRemunerationContribution.toFixed(3),

            pifssUnemployment:
                pifss.unemploymentContribution.toFixed(3),

            pifssTotal:
                pifss.total.toFixed(3)
        };
    }
}