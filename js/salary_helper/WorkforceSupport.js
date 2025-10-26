import { BaseSalary } from './BaseSalary.js';
import { DEGREE_DATA, PostGradStatus } from './salary_data.js';

export class WorkforceSupport extends BaseSalary {
    static CHILDREN_INCREMENT = 50; // Fixed at 50 KD per child, max 7 children
    static SALARY_CAP = 1250; // Salary cap for increment adjustment

    constructor(baseSalary, maritalStatus, degreeType, numChildren, postGradStatus) {
        super(baseSalary);

        if (!DEGREE_DATA[degreeType]) {
            throw new Error("Invalid degree type");
        }

        this.maritalStatus = maritalStatus;
        this.degreeType = degreeType;
        this.numChildren = Math.min(numChildren, 7); // Max 7 children allowed
        this.postGradStatus = postGradStatus;

        this.postGradIncrease = PostGradStatus[this.postGradStatus];

        const degreeInfo = DEGREE_DATA[degreeType];
        this.socialAllowance = degreeInfo.social_allowance[maritalStatus];
        this.additionalBase = degreeInfo.additional; // Store the base additional object
        this.degreeIncrement = degreeInfo.degree_increment;
        this.socialAllowanceIncrease = degreeInfo.social_allowance_increase[maritalStatus];
        this.childrenIncrement = this.numChildren * WorkforceSupport.CHILDREN_INCREMENT;

        // Calculate the adjusted additional based on salary cap
        this.additional = this.calculateAdjustedAdditional();
    }

    calculateAdjustedAdditional() {
        // Calculate total without the increment (50 KD)
        const baseAdditional = this.additionalBase.cost_of_living + this.additionalBase.bonus;
        const totalWithoutIncrement = this.baseSalary;

        // If total without increment is already at or above cap, no increment
        if (totalWithoutIncrement >= WorkforceSupport.SALARY_CAP) {
            return {
                cost_of_living: this.additionalBase.cost_of_living,
                bonus: this.additionalBase.bonus,
                increment: 0
            };
        }

        // Calculate how much increment can be added
        const remainingToCap = WorkforceSupport.SALARY_CAP - totalWithoutIncrement;
        const adjustedIncrement = Math.min(this.additionalBase.increment, remainingToCap);

        return {
            cost_of_living: this.additionalBase.cost_of_living,
            bonus: this.additionalBase.bonus,
            increment: adjustedIncrement
        };
    }

    calculateTotalWFSAllowance() {
        const additionalTotal = this.additional.cost_of_living +
            this.additional.bonus +
            this.additional.increment;

        return (
            this.socialAllowance +
            this.socialAllowanceIncrease +
            this.degreeIncrement +
            this.childrenIncrement +
            this.postGradIncrease +
            additionalTotal
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