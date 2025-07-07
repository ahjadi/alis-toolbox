# Kuwait Salary Calculator

A web-based salary calculator for Kuwait workforce support (WFS) calculations. This tool helps calculate net salary after deductions based on various factors including marital status, degree type, and number of children.

## Features

- **Basic Calculator**: Quick salary calculation with WFS allowances
- **Advanced Calculator**: Additional adjustments including housing compensation and other additions/deductions
- **User-Friendly Interface**: 
  - Toggle switch for marital status
  - Visual button selection for number of children
  - Clean, modern design with Dubai font
- **Responsive Design**: Works on desktop and mobile devices

## Live Demo

[Visit the calculator](https://ahjadi.github.io/priv-salary/)

## Calculations Included

The calculator considers the following factors:
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

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ahjadi/salary-calculator.git
   ```

2. Open `index.html` in your web browser to use the basic calculator
3. Navigate to `advanced.html` for the advanced calculator with additional options

## Project Structure

```
salary-calculator/
├── index.html          # Basic calculator
├── advanced.html       # Advanced calculator
├── css/
│   ├── styles.css      # Main stylesheet
│   ├── normalize.css   # CSS reset (optional)
│   ├── fonts/          # Dubai font files
│   └── favicon.ico     # Site favicon
├── js/
│   └── calculator.js   # Calculator logic
└── README.md
```

## Development

The calculator is built with vanilla JavaScript and requires no build process or dependencies. To modify:

1. Edit `js/calculator.js` for calculation logic
2. Modify `css/styles.css` for styling changes
3. Update HTML files for structural changes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Uses Dubai font for authentic regional typography
- Based on Kuwait workforce support regulations
