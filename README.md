# Kuwait Financial Calculator Suite

A comprehensive web-based financial calculator suite for Kuwait, featuring salary calculations with workforce support (WFS - دعم العمالة) and advanced loan analysis tools.

## Features

### Salary Calculator
- **Basic Calculator**: Quick salary calculation with WFS allowances
- **Advanced Calculator**: Additional adjustments including housing compensation and other additions/deductions
- **User-Friendly Interface**: 
  - Toggle switch for marital status
  - Visual button selection for number of children
  - Clean, modern design with Dubai font
- **Responsive Design**: Works on desktop and mobile devices

### Loan Calculator
- **Basic Loan Calculator**: Standard loan payment calculations with amortization schedules
- **Advanced Loan Calculator**: Early payment scenarios and comprehensive analysis
- **Key Features**:
  - Extra monthly payment calculations
  - Lump sum payment analysis
  - Payment strategy comparisons
  - Interest savings calculations
  - Detailed amortization tables
  - Time savings analysis

## Live Demo

[Visit the calculator suite](https://ahjadi.github.io/alis-toolbox/)

## Salary Calculations Included

The salary calculator considers the following factors:
- Base salary
- Social allowance (based on marital status and degree)
- Degree increment (based on education level)
- Children allowance (50 KWD per child, max 7 children)
- Additional fixed allowance
- Tax deductions (10.5% on taxable components)

### Supported Degree Types
- Medical/Engineering/Pharmacy
- Other Bachelor degrees (Type 1 & 2)
- Diploma
- High School
- Middle School

## Loan Calculations Included

The loan calculator provides:
- Monthly payment calculations using standard loan formulas
- Complete amortization schedules
- Early payment scenario analysis
- Interest savings from extra payments
- Payment strategy comparisons (extra monthly vs lump sum payments)
- Time reduction calculations

### Loan Features
- Flexible loan terms (12-120 months)
- Variable interest rates
- Extra monthly payment options
- One-time lump sum payments
- Comprehensive savings analysis

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ahjadi/priv-salary.git
   ```

2. Open any HTML file in your web browser:
   - `index.html` - Basic salary calculator
   - `advanced.html` - Advanced salary calculator
   - `loan.html` - Basic loan calculator
   - `loan-advanced.html` - Advanced loan calculator with early payment scenarios

## Project Structure

```
financial-calculator/
├── index.html              # Basic salary calculator
├── advanced.html           # Advanced salary calculator
├── loan.html               # Basic loan calculator
├── loan-advanced.html      # Advanced loan calculator
├── css/
│   ├── styles.css          # Main stylesheet
│   ├── normalize.css       # CSS reset (optional)
│   ├── fonts/              # Dubai font files
│   └── favicon.ico         # Site favicon
├── js/
│   ├── calculator.js       # Salary calculator logic
│   └── loan_calculator.js  # Loan calculator logic
└── README.md
```

## Navigation

The application features a unified navigation bar allowing seamless switching between:
- **Salary Calculator** - Basic workforce support calculations
- **Advanced** - Advanced salary calculations with additional options
- **Loan Calculator** - Basic loan payment calculations
- **Loan Advanced** - Advanced loan analysis with early payment scenarios

## Development

The calculator suite is built with vanilla JavaScript and requires no build process or dependencies. To modify:

1. Edit `js/calculator.js` for salary calculation logic
2. Edit `js/loan_calculator.js` for loan calculation logic
3. Modify `css/styles.css` for styling changes
4. Update HTML files for structural changes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Currency

All calculations are performed and displayed in Kuwaiti Dinars (KWD) with appropriate precision:
- Salary calculations: 3 decimal places
- Loan calculations: 3 decimal places
- Interest rates: 2 decimal places

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Uses Dubai font for authentic regional typography
- Based on Kuwait workforce support regulations
- Implements standard loan calculation formulas
- Designed for Kuwait financial planning needs
