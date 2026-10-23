// Получаем элемент экрана, куда будем выводить текущее число / результат
const resultEl = document.getElementById('result');

// current   — число, которое сейчас вводится или показывается на экране
// previous  — число, введённое ДО выбора операции (первый операнд)
// operator  — выбранная операция: '+', '-', '*' или '/'
// resetNext — флаг: если true, следующая нажатая цифра начнёт НОВОЕ число,
//             а не допишется к уже показанному
let current = '0';
let previous = null;
let operator = null;
let resetNext = false;

// Пункт 17: точность (сколько цифр после запятой округлять результат)
// берётся из выпадающего списка <select id="precision-select">
let precision = 2;
const precisionSelect = document.getElementById('precision-select');

// Слушаем изменение выпадающего списка: при выборе другого пункта
// обновляем переменную precision, которую использует calculate() и другие функции
precisionSelect.addEventListener('change', () => {
  precision = parseInt(precisionSelect.value, 10);
});

// updateDisplay() — выводит текущее значение переменной current на экран калькулятора.
// Вызывается после КАЖДОГО действия (ввод цифры, операция, очистка и т.д.),
// чтобы пользователь сразу видел актуальное число.
function updateDisplay() {
  resultEl.textContent = current;
}

// inputDigit(d) — обрабатывает нажатие на цифровую кнопку (0-9).
// Принимает: d — строка с нажатой цифрой ("0".."9").
// Если только что был получен результат (resetNext === true), начинаем ввод
// нового числа с нуля. Иначе — дописываем цифру в конец текущего числа.
function inputDigit(d) {
  if (resetNext) { current = '0'; resetNext = false; }
  current = current === '0' ? d : current + d;
}

// inputDot() — обрабатывает нажатие на кнопку точки (.).
// Добавляет десятичную точку, но только если её ещё нет в числе
// (чтобы нельзя было ввести "12.34.56").
function inputDot() {
  if (resetNext) { current = '0'; resetNext = false; }
  if (!current.includes('.')) current += '.';
}

// chooseOperator(op) — обрабатывает нажатие на кнопку операции (+, −, ×, /).
// Принимает: op — символ операции ('+', '-', '*' или '/').
// Если операция уже была выбрана ранее и число успели ввести (цепочка вида
// "5 + 3 +"), сначала считает промежуточный результат через calculate(),
// чтобы вычисления накапливались одно за другим.
// Затем запоминает текущее число как previous и сохраняет новую операцию.
function chooseOperator(op) {
  if (operator && !resetNext) calculate();
  previous = current;
  operator = op;
  resetNext = true;
}

// calculate() — выполняет само вычисление: previous (op) current.
// Если операция или первое число не заданы — ничего не делает (защита от ошибок).
// Результат округляется до precision знаков после запятой (см. выпадающий список)
// и становится новым значением current. previous и operator сбрасываются,
// чтобы можно было начать новый расчёт с нуля.
function calculate() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let r;
  switch (operator) {
    case '+': r = a + b; break;
    case '-': r = a - b; break;
    case '*': r = a * b; break;
    case '/': r = b === 0 ? 0 : a / b; break; // деление на 0 заменяем на 0, чтобы не было Infinity
    default: return;
  }
  current = String(parseFloat(r.toFixed(precision)));
  operator = null;
  previous = null;
  resetNext = true;
}

// Находим ВСЕ кнопки, чей id начинается с "btn_digit_" (это все цифры 0-9 и точка),
// и каждой из них назначаем обработчик клика: вызвать inputDigit или inputDot,
// а затем обновить экран.
document.querySelectorAll('[id^="btn_digit_"]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.id === 'btn_digit_dot') inputDot();
    else inputDigit(btn.textContent);
    updateDisplay();
  });
});

// Назначаем обработчики клика на 4 кнопки основных арифметических операций —
// каждая просто вызывает chooseOperator() с нужным символом операции.
document.getElementById('btn_op_plus').addEventListener('click', () => chooseOperator('+'));
document.getElementById('btn_op_minus').addEventListener('click', () => chooseOperator('-'));
document.getElementById('btn_op_mult').addEventListener('click', () => chooseOperator('*'));
document.getElementById('btn_op_div').addEventListener('click', () => chooseOperator('/'));

// Кнопка "=" — запускает вычисление и сразу обновляет экран с результатом.
document.getElementById('btn_op_equal').addEventListener('click', () => {
  calculate();
  updateDisplay();
});

// Кнопка "C" (Clear) — полностью сбрасывает калькулятор в исходное состояние:
// экран показывает 0, все сохранённые числа и операция обнуляются.
document.getElementById('btn_op_clear').addEventListener('click', () => {
  current = '0'; previous = null; operator = null; resetNext = false;
  updateDisplay();
});

// Кнопка "+/-" — меняет знак текущего числа:
// если число уже отрицательное — убирает минус, если нет — добавляет.
document.getElementById('btn_op_sign').addEventListener('click', () => {
  if (current !== '0') current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
});

// Кнопка "%" — делит текущее число на 100 (перевод в проценты).
document.getElementById('btn_op_percent').addEventListener('click', () => {
  current = String(parseFloat(current) / 100);
  updateDisplay();
});

// Пункт 12: кнопка переключения темы оформления (🌙 тёмная <-> ☀️ светлая).
// При клике проверяем текущую тему у <body> и меняем её на противоположную,
// а также меняем иконку на самой кнопке. Все цвета темы уже прописаны
// в style.css через CSS-переменные и подключаются автоматически.
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const body = document.body;
  const isDark = body.getAttribute('data-theme') === 'dark';
  body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
});

/* ===================== ЛР2: задания для самостоятельной проработки ===================== */

// Пункт 3: кнопка "⌫" (backspace) — стирает ПОСЛЕДНИЙ введённый символ.
// Если в числе остался только один символ — заменяем его на "0",
// чтобы экран не оставался пустым.
document.getElementById('btn_op_backspace').addEventListener('click', () => {
  current = current.length > 1 ? current.slice(0, -1) : '0';
  updateDisplay();
});

// Пункт 5: кнопка "√" — вычисляет квадратный корень из текущего числа.
// Из отрицательного числа корень не извлекается — показываем "Ошибка".
// После вычисления resetNext = true, чтобы следующая цифра начала новый ввод.
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

// Пункт 6: кнопка "x²" — возводит текущее число в квадрат (умножает само на себя).
document.getElementById('btn_op_square').addEventListener('click', () => {
  const n = parseFloat(current);
  current = String(parseFloat((n * n).toFixed(precision)));
  resetNext = true;
  updateDisplay();
});

// Пункт 7: кнопка "x!" — вычисляет факториал (n! = 1 × 2 × 3 × ... × n).
// Факториал определён только для целых чисел >= 0, поэтому для отрицательных
// и дробных чисел показываем "Ошибка". Само вычисление — обычный цикл,
// в котором result последовательно умножается на числа от 2 до n.
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

// Пункт 8: кнопка "000" — быстро дописывает три нуля в конец текущего числа
// (удобно для ввода больших сумм). Если resetNext активен (начинаем новое
// число), сначала сбрасываем экран, как и при обычном вводе цифры.
document.getElementById('btn_op_triplezero').addEventListener('click', () => {
  if (resetNext) { current = '0'; resetNext = false; }
  if (current !== '0') current += '000';
  updateDisplay();
});

// Пункт 12: индивидуальная операция — кнопка "1/x" вычисляет ОБРАТНОЕ число
// (единицу, делённую на текущее число). На ноль делить нельзя — в этом
// случае показываем "Ошибка".
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
