export class BaseSalary {
    constructor(baseSalary) {
        this.baseSalary = baseSalary;
    }

    calculateTax(taxRate = 10.5) {
        return Math.round(this.baseSalary * (taxRate / 100) * 1000) / 1000;
    }

    calculateBaseSalaryTaxed(taxRate = 10.5) {
        if (this.baseSalary >= 1500)
            return Math.round((this.baseSalary - 157.5) * 1000) / 1000; // Fixed tax of 157.5 KD for salaries 1500 KD and above
        else
            return Math.round((this.baseSalary - this.calculateTax(taxRate)) * 1000) / 1000;
    }
}