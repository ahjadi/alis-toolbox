import {
    DEGREE_DATA,
    POST_GRADUATE_ALLOWANCE,
    WFS_ADDITIONAL
} from './salaryData.js';

const PIFSS = {
    BASIC_RATE: 0.05,
    SUPPLEMENTARY_RATE: 0.05,

    BASIC_CEILING: 1500,
    SUPPLEMENTARY_CEILING: 1250,

    TOTAL_CEILING: 2750
};

const WFS = {
    CHILDREN_ALLOWANCE: 50,
    MAX_CHILDREN: 7,
    SALARY_CAP: 1250
};

function round(value) {
    return Math.round((value + Number.EPSILON) * 1000) / 1000;
}


/*
 * Calculate Workforce Support
 */
function calculateWFS({
    baseSalary,
    maritalStatus,
    degreeType,
    numChildren,
    postGradStatus
}) {
    const degreeInfo = DEGREE_DATA[degreeType];

    if (!degreeInfo) {
        throw new Error('Invalid degree type');
    }

    const children =
        Math.min(
            Math.max(numChildren, 0),
            WFS.MAX_CHILDREN
        );

    const postGradIncrease =
        POST_GRADUATE_ALLOWANCE[postGradStatus] || 0;

    const socialAllowance =
        degreeInfo.socialAllowance[maritalStatus];

    const degreeIncrement =
        degreeInfo.degreeIncrement;

    const socialAllowanceIncrease =
        degreeInfo.socialAllowanceIncrease[maritalStatus];

    /*
     * The KD 50 increment is limited by the KD 1,250 rule.
     */
    const adjustedIncrement =
        Math.max(
            Math.min(
                WFS_ADDITIONAL.INCREMENT,
                WFS.SALARY_CAP - baseSalary
            ),
            0
        );

    const additional = {
        costOfLiving:
            WFS_ADDITIONAL.COST_OF_LIVING,

        bonus:
            WFS_ADDITIONAL.BONUS,

        increment:
            adjustedIncrement
    };

    const childrenAllowance =
        children * WFS.CHILDREN_ALLOWANCE;

    /*
     * Total WFS allowance.
     */
    const total =
        socialAllowance +
        socialAllowanceIncrease +
        degreeIncrement +
        childrenAllowance +
        postGradIncrease +
        additional.costOfLiving +
        additional.bonus +
        additional.increment;

    /*
     * WFS components included in PIFSS.
     *
     * socialAllowanceIncrease is intentionally excluded.
     */
    const pifssInsurable =
        socialAllowance +
        childrenAllowance +
        degreeIncrement +
        postGradIncrease;

    /*
     * WFS components outside PIFSS.
     */
    const nonPifss =
        additional.costOfLiving +
        additional.bonus +
        additional.increment;

    return {
        total: round(total),

        pifssInsurable:
            round(pifssInsurable),

        nonPifss:
            round(nonPifss),

        socialAllowance:
            round(socialAllowance),

        socialAllowanceIncrease:
            round(socialAllowanceIncrease),

        degreeIncrement:
            round(degreeIncrement),

        childrenAllowance:
            round(childrenAllowance),

        postGradIncrease:
            round(postGradIncrease),

        additional
    };
}


/*
 * Calculate PIFSS
 */
function calculatePIFSS(
    baseSalary,
    pifssInsurableWfs
) {
    /*
     * Basic insurance salary:
     *
     * Base salary + applicable WFS
     * capped at KD 1,500.
     */
    const basicInsuranceSalary =
        Math.min(
            baseSalary + pifssInsurableWfs,
            PIFSS.BASIC_CEILING
        );

    /*
     * Total insurance salary used to determine
     * the supplementary portion.
     */
    const totalInsuranceSalary =
        baseSalary + pifssInsurableWfs;

    /*
     * Amount above KD 1,500,
     * capped at KD 1,250.
     */
    const supplementaryInsuranceSalary =
        Math.min(
            Math.max(
                totalInsuranceSalary -
                PIFSS.BASIC_CEILING,
                0
            ),
            PIFSS.SUPPLEMENTARY_CEILING
        );

    const basicContribution =
        round(
            basicInsuranceSalary *
            PIFSS.BASIC_RATE
        );

    const supplementaryContribution =
        round(
            supplementaryInsuranceSalary *
            PIFSS.SUPPLEMENTARY_RATE
        );

    /*
     * Keep these available internally for now.
     *
     * We are NOT changing the existing contribution
     * rules during the restructuring.
     */
    const pensionIncreaseContribution =
        round(
            Math.min(
                basicInsuranceSalary +
                supplementaryInsuranceSalary,
                PIFSS.TOTAL_CEILING
            ) * 0.025
        );

    const financialRemunerationContribution =
        round(
            Math.min(
                basicInsuranceSalary,
                PIFSS.BASIC_CEILING
            ) * 0.025
        );

    const unemploymentContribution =
        round(
            Math.min(
                basicInsuranceSalary +
                supplementaryInsuranceSalary,
                PIFSS.TOTAL_CEILING
            ) * 0.005
        );

    /*
     * This currently matches the existing calculation,
     * including all five contributions in total.
     */
    const total =
        round(
            basicContribution +
            supplementaryContribution +
            pensionIncreaseContribution +
            financialRemunerationContribution +
            unemploymentContribution
        );

    return {
        basicInsuranceSalary:
            round(basicInsuranceSalary),

        supplementaryInsuranceSalary:
            round(supplementaryInsuranceSalary),

        basicContribution,

        supplementaryContribution,

        pensionIncreaseContribution,

        financialRemunerationContribution,

        unemploymentContribution,

        total
    };
}


/*
 * Main salary calculation
 *
 * Handles both:
 * - Basic salary calculation
 * - Advanced salary modifications
 */
export function calculateSalary(input) {

    const {
        baseSalary,
        maritalStatus,
        degreeType,
        numChildren,
        postGradStatus,

        housingCompensation = 0,
        salaryAddition = 0,
        salaryRemoval = 0
    } = input;


    /*
     * Validate base salary.
     */
    if (!Number.isFinite(baseSalary)) {
        throw new Error('Please enter a valid base salary');
    }


    /*
     * Validate number of children.
     */
    if (!Number.isFinite(numChildren)) {
        throw new Error('Please enter a valid number of children');
    }


    /*
     * Validate advanced salary modifications.
     */
    if (!Number.isFinite(housingCompensation)) {
        throw new Error('Please enter a valid housing compensation');
    }

    if (!Number.isFinite(salaryAddition)) {
        throw new Error('Please enter a valid salary addition');
    }

    if (!Number.isFinite(salaryRemoval)) {
        throw new Error('Please enter a valid salary removal');
    }


    /*
     * Calculate WFS.
     */
    const wfs =
        calculateWFS({
            baseSalary,
            maritalStatus,
            degreeType,
            numChildren,
            postGradStatus
        });


    /*
     * Calculate PIFSS.
     */
    const pifss =
        calculatePIFSS(
            baseSalary,
            wfs.pifssInsurable
        );


    /*
     * Calculate gross salary before PIFSS.
     */
    const grossSalary =
        round(
            baseSalary +
            wfs.total
        );


    /*
     * Calculate net salary after PIFSS.
     */
    const netSalary =
        round(
            grossSalary -
            pifss.total
        );


    /*
     * Calculate final salary after
     * advanced modifications.
     *
     * Housing is added.
     * Salary addition is added.
     * Salary removal is deducted.
     */
    const finalSalary =
        round(
            netSalary +
            housingCompensation +
            salaryAddition -
            salaryRemoval
        );


    return {
        baseSalary:
            round(baseSalary),

        wfs,

        grossSalary,

        pifss,

        netSalary,

        housingCompensation:
            round(housingCompensation),

        salaryAddition:
            round(salaryAddition),

        salaryRemoval:
            round(salaryRemoval),

        finalSalary
    };
}