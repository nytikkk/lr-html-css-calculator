const resultEl = document.getElementById('result');
let current = '0';
let previous = null;
let operator = null;
let resetNext = false;

function updateDisplay() {
  resultEl.textContent = current;
}

function inputDigit(d) {
  if (resetNext) { current = '0'; resetNext = false; }
  current = current === '0' ? d : current + d;
}

function inputDot() {
  if (resetNext) { current = '0'; resetNext = false; }
  if (!current.includes('.')) current += '.';
}

function chooseOperator(op) {
  if (operator && !resetNext) calculate();
  previous = current;
  operator = op;
  resetNext = true;
}

function calculate() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let r;
  switch (operator) {
    case '+': r = a + b; break;
    case '-': r = a - b; break;
    case '*': r = a * b; break;
    case '/': r = b === 0 ? 0 : a / b; break;
    default: return;
  }
  current = String(Math.round(r * 1e10) / 1e10);
  operator = null;
  previous = null;
  resetNext = true;
}

document.querySelectorAll('[id^="btn_digit_"]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.id === 'btn_digit_dot') inputDot();
    else inputDigit(btn.textContent);
    updateDisplay();
  });
});

document.getElementById('btn_op_plus').addEventListener('click', () => chooseOperator('+'));
document.getElementById('btn_op_minus').addEventListener('click', () => chooseOperator('-'));
document.getElementById('btn_op_mult').addEventListener('click', () => chooseOperator('*'));
document.getElementById('btn_op_div').addEventListener('click', () => chooseOperator('/'));

document.getElementById('btn_op_equal').addEventListener('click', () => {
  calculate();
  updateDisplay();
});

document.getElementById('btn_op_clear').addEventListener('click', () => {
  current = '0'; previous = null; operator = null; resetNext = false;
  updateDisplay();
});

document.getElementById('btn_op_sign').addEventListener('click', () => {
  if (current !== '0') current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
});

document.getElementById('btn_op_percent').addEventListener('click', () => {
  current = String(parseFloat(current) / 100);
  updateDisplay();
});
