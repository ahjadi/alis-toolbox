export class LoanCalculator {
    constructor(principal, annualRate, termMonths) {
        this.principal = principal;
        this.annualRate = annualRate;
        this.termMonths = termMonths;
        this.monthlyRate = annualRate / 100 / 12;
    }

    // Calculate standard monthly payment using loan formula
    calculateMonthlyPayment() {
        if (this.monthlyRate === 0) {
            return this.principal / this.termMonths;
        }
        
        const numerator = this.principal * this.monthlyRate * Math.pow(1 + this.monthlyRate, this.termMonths);
        const denominator = Math.pow(1 + this.monthlyRate, this.termMonths) - 1;
        return numerator / denominator;
    }

    // Generate complete amortization schedule
    generateAmortizationSchedule() {
        const monthlyPayment = this.calculateMonthlyPayment();
        let remainingBalance = this.principal;
        const schedule = [];

        for (let month = 1; month <= this.termMonths; month++) {
            const interestPayment = remainingBalance * this.monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            remainingBalance = Math.max(0, remainingBalance - principalPayment);

            schedule.push({
                month: month,
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: remainingBalance
            });

            if (remainingBalance <= 0) break;
        }

        return schedule;
    }

    // Calculate early payment scenarios
    calculateEarlyPaymentScenario(extraMonthlyPayment = 0, lumpSumPayment = 0, lumpSumMonth = 0) {
        const baseMonthlyPayment = this.calculateMonthlyPayment();
        let remainingBalance = this.principal;
        const schedule = [];
        let month = 0;
        let totalInterest = 0;

        while (remainingBalance > 0.01 && month < this.termMonths) {
            month++;
            
            const interestPayment = remainingBalance * this.monthlyRate;
            let monthlyPayment = baseMonthlyPayment + extraMonthlyPayment;
            
            // Apply lump sum payment if specified
            if (month === lumpSumMonth && lumpSumPayment > 0) {
                monthlyPayment += lumpSumPayment;
            }

            // Don't overpay
            if (monthlyPayment > remainingBalance + interestPayment) {
                monthlyPayment = remainingBalance + interestPayment;
            }

            const principalPayment = monthlyPayment - interestPayment;
            remainingBalance = Math.max(0, remainingBalance - principalPayment);
            totalInterest += interestPayment;

            schedule.push({
                month: month,
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: remainingBalance
            });

            if (remainingBalance <= 0) break;
        }

        return {
            schedule: schedule,
            totalMonths: month,
            totalInterest: totalInterest,
            totalPayment: this.principal + totalInterest,
            monthsSaved: this.termMonths - month
        };
    }

    // Calculate savings from different payment strategies
    calculatePaymentStrategies() {
        const baseScenario = this.calculateEarlyPaymentScenario(0, 0, 0);
        
        const strategies = [
            { name: "Standard Payment", extra: 0, lump: 0, month: 0 },
            { name: "Extra KWD 50/month", extra: 50, lump: 0, month: 0 },
            { name: "Extra KWD 100/month", extra: 100, lump: 0, month: 0 },
            { name: "Extra KWD 200/month", extra: 200, lump: 0, month: 0 },
            { name: "KWD 1000 lump sum (Month 12)", extra: 0, lump: 1000, month: 12 },
            { name: "KWD 2000 lump sum (Month 6)", extra: 0, lump: 2000, month: 6 }
        ];

        return strategies.map(strategy => {
            const scenario = this.calculateEarlyPaymentScenario(strategy.extra, strategy.lump, strategy.month);
            return {
                ...strategy,
                totalMonths: scenario.totalMonths,
                totalInterest: scenario.totalInterest,
                totalPayment: scenario.totalPayment,
                monthsSaved: scenario.monthsSaved,
                interestSaved: baseScenario.totalInterest - scenario.totalInterest
            };
        });
    }

    // Get loan summary
    getLoanSummary() {
        const monthlyPayment = this.calculateMonthlyPayment();
        const totalPayment = monthlyPayment * this.termMonths;
        const totalInterest = totalPayment - this.principal;

        return {
            monthlyPayment: monthlyPayment.toFixed(3),
            totalPayment: totalPayment.toFixed(3),
            totalInterest: totalInterest.toFixed(3),
            effectiveRate: ((totalInterest / this.principal) * 100).toFixed(2)
        };
    }
}