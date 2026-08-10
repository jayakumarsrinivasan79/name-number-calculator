'use strict';

/**
 * Numerology letter values.
 * Each letter of the alphabet maps to a single digit (1-8); no letter maps to 9.
 */
const LETTER_VALUES = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

// Only letters, spaces, and periods are accepted (e.g. "V.R. Vijay Manoj").
const VALID_NAME_PATTERN = /^[A-Z .]*$/;

const nameInput = document.getElementById('name-input');
const clearButton = document.getElementById('clear-button');
const errorMessage = document.getElementById('error-message');
const pyramidOutput = document.getElementById('pyramid-output');
const nameNumberOutput = document.getElementById('name-number-output');
const reducedNumberOutput = document.getElementById('reduced-number-output');
const pyramidNumberOutput = document.getElementById('pyramid-number-output');

/** Reduces a number to a single digit (1-9), wrapping a 0 remainder to 9. */
function reduceToSingleDigit(value) {
  const remainder = value % 9;
  return remainder === 0 ? 9 : remainder;
}

/**
 * Repeatedly sums adjacent digits (mod 9, treating a 0 remainder as 9) to fold a row
 * down to a single apex digit, recording every intermediate row along the way.
 */
function buildPyramidRows(digits) {
  const rows = [digits];
  let row = digits;

  while (row.length > 1) {
    const nextRow = [];
    for (let i = 0; i < row.length - 1; i++) {
      nextRow.push(reduceToSingleDigit(row[i] + row[i + 1]));
    }
    rows.push(nextRow);
    row = nextRow;
  }

  return rows;
}

/** Renders pyramid rows as centered lines of space-separated digits, widest row on top. */
function formatPyramid(rows) {
  const widestRowWidth = rows[0].length * 2 - 1;
  return rows
    .map((row) => row.join(' ').padStart((widestRowWidth + row.join(' ').length) / 2).padEnd(widestRowWidth))
    .join('\n');
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.hidden = true;
}

function clearResults() {
  pyramidOutput.textContent = '';
  nameNumberOutput.textContent = '–';
  reducedNumberOutput.textContent = '–';
  pyramidNumberOutput.textContent = '–';
}

function calculate() {
  const rawName = nameInput.value;

  if (rawName.trim() === '') {
    clearError();
    clearResults();
    return;
  }

  const upperName = rawName.toUpperCase();
  if (!VALID_NAME_PATTERN.test(upperName)) {
    showError('Please use letters, spaces, and periods only.');
    clearResults();
    return;
  }
  clearError();

  const digits = [];
  for (const char of upperName) {
    if (char in LETTER_VALUES) {
      digits.push(LETTER_VALUES[char]);
    }
  }

  if (digits.length === 0) {
    clearResults();
    return;
  }

  const nameNumber = digits.reduce((sum, value) => sum + value, 0);
  const rows = buildPyramidRows(digits);
  const pyramidNumber = rows[rows.length - 1][0];

  pyramidOutput.textContent = formatPyramid(rows);
  nameNumberOutput.textContent = String(nameNumber);
  reducedNumberOutput.textContent = String(reduceToSingleDigit(nameNumber));
  pyramidNumberOutput.textContent = String(pyramidNumber);
}

function clearAll() {
  nameInput.value = '';
  clearError();
  clearResults();
  nameInput.focus();
}

nameInput.addEventListener('input', calculate);
clearButton.addEventListener('click', clearAll);

clearResults();
