const resultEl = document.getElementById('result');
let current = '0';
let previous = null;
let operator = null;
let resetNext = false;

// Пункт 17: точность (сколько цифр после запятой) берётся из выпадающего списка
let precision = 2;
const precisionSelect = document.getElementById('precision-select');
precisionSelect.addEventListener('change', () => {
  precision = parseInt(precisionSelect.value, 10);
});

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
  current = String(parseFloat(r.toFixed(precision)));
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

// Пункт 12: переключение темы (тёмная <-> светлая)
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const body = document.body;
  const isDark = body.getAttribute('data-theme') === 'dark';
  body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
});

/* ===================== ЛР2: задания для самостоятельной проработки ===================== */

// Пункт 3: backspace — стирает последнюю введённую цифру
document.getElementById('btn_op_backspace').addEventListener('click', () => {
  current = current.length > 1 ? current.slice(0, -1) : '0';
  updateDisplay();
});

// Пункт 5: квадратный корень √
document.getElementById('btn_op_sqrt').addEventListener('click', () => {
  const n = parseFloat(current);
  if (n < 0) {
    current = 'Ошибка'; // из отрицательного числа корень не извлечь
  } else {
    current = String(parseFloat(Math.sqrt(n).toFixed(precision)));
  }
  resetNext = true;
  updateDisplay();
});

// Пункт 6: возведение в квадрат x²
document.getElementById('btn_op_square').addEventListener('click', () => {
  const n = parseFloat(current);
  current = String(parseFloat((n * n).toFixed(precision)));
  resetNext = true;
  updateDisplay();
});

// Пункт 7: факториал x! (определён только для целых чисел >= 0)
document.getElementById('btn_op_factorial').addEventListener('click', () => {
  const n = parseFloat(current);
  if (n < 0 || !Number.isInteger(n)) {
    current = 'Ошибка';
  } else {
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    current = String(result);
  }
  resetNext = true;
  updateDisplay();
});

// Пункт 8: кнопка добавления сразу трёх нулей (000)
document.getElementById('btn_op_triplezero').addEventListener('click', () => {
  if (resetNext) { current = '0'; resetNext = false; }
  if (current !== '0') current += '000';
  updateDisplay();
});

// Пункт 12: индивидуальная операция — обратное число (1/x)
document.getElementById('btn_op_reciprocal').addEventListener('click', () => {
  const n = parseFloat(current);
  if (n === 0) {
    current = 'Ошибка'; // деление на ноль
  } else {
    current = String(parseFloat((1 / n).toFixed(precision)));
  }
  resetNext = true;
  updateDisplay();
});
