// Calculator functionality with animations
document.addEventListener('DOMContentLoaded', function() {
    const display = document.querySelector('.display-value');
    const previousCalculation = document.querySelector('.previous-calculation');
    const buttons = document.querySelectorAll('.button');

    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetInput = false;
    let calculationHistory = '';

    // Update the display with current value
    function updateDisplay() {
        // Format numbers with commas for thousands
        let displayValue = currentInput;
        if (!isNaN(parseFloat(displayValue)) && isFinite(displayValue)) {
            // Handle decimal numbers properly
            if (displayValue.includes('.')) {
                const parts = displayValue.split('.');
                displayValue = parseFloat(parts[0]).toLocaleString() + '.' + parts[1];
            } else {
                displayValue = parseFloat(displayValue).toLocaleString();
            }
        }

        // Ensure we don't show NaN or other errors
        if (displayValue === 'NaN' || displayValue === 'Infinity') {
            displayValue = 'Error';
        }

        display.textContent = displayValue;
    }

    // Update previous calculation display
    function updatePreviousCalculation() {
        previousCalculation.textContent = calculationHistory;
    }

    // Handle number button click
    function inputNumber(number) {
        if (currentInput === '0' || resetInput) {
            currentInput = number;
            resetInput = false;
        } else {
            currentInput += number;
        }
        updateDisplay();
    }

    // Handle decimal point
    function inputDecimal() {
        if (resetInput) {
            currentInput = '0.';
            resetInput = false;
        } else if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    }

    // Handle operator selection
    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        // If we already have a pending operation, perform it
        if (operation && !resetInput) {
            calculate();
        } else if (!previousInput) {
            previousInput = currentInput;
        }

        // Set up for next input
        operation = nextOperator;
        calculationHistory = `${previousInput} ${operation}`;
        resetInput = true;

        updatePreviousCalculation();
    }

    // Perform calculation
    function calculate() {
        if (!operation || resetInput) return;

        const prevValue = parseFloat(previousInput);
        const currentValue = parseFloat(currentInput);
        let result;

        switch (operation) {
            case '+':
                result = prevValue + currentValue;
                break;
            case '-':
                result = prevValue - currentValue;
                break;
            case '×':
                result = prevValue * currentValue;
                break;
            case '÷':
                result = prevValue / currentValue;
                break;
            case '%':
                result = prevValue % currentValue;
                break;
            default:
                return;
        }

        // Update calculation history
        calculationHistory = `${previousInput} ${operation} ${currentInput} =`;

        // Update current input with result
        currentInput = result.toString();
        operation = null;
        previousInput = '';
        resetInput = true;

        updateDisplay();
        updatePreviousCalculation();
    }

    // Clear the calculator
    function clearCalculator() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        resetInput = false;
        calculationHistory = '';

        // Add a little animation when clearing
        display.classList.add('fade-out');
        setTimeout(() => {
            updateDisplay();
            updatePreviousCalculation();
            display.classList.remove('fade-out');
        }, 150);
    }

    // Add button animation
    function animateButton(button) {
        button.classList.add('active');
        setTimeout(() => {
            button.classList.remove('active');
        }, 200);
    }

    // Add event listeners to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Animate button press
            animateButton(button);

            const buttonValue = button.textContent;

            // Handle different button types
            if (!isNaN(parseFloat(buttonValue)) || buttonValue === '0') {
                inputNumber(buttonValue);
            } else if (buttonValue === '.') {
                inputDecimal();
            } else if (buttonValue === 'C') {
                clearCalculator();
            } else if (buttonValue === '=') {
                calculate();
            } else {
                // This must be an operator
                handleOperator(buttonValue);
            }
        });
    });

    // Initialize display
    updateDisplay();
});