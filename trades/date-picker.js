const DATE_FIELD_SELECTOR = "[data-calendar-field]";
const DISPLAY_SELECTOR = "[data-calendar-display]";
const TRIGGER_SELECTOR = "[data-calendar-trigger]";

const DATE_DISPLAY_REGEXP = /^(\d{2})\.(\d{2})\.(\d{2}|\d{4})$/;

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
};

const parseDisplayValue = (value = "") => {
  const match = value.trim().match(DATE_DISPLAY_REGEXP);
  if (!match) {
    return null;
  }

  const [, dayPart, monthPart, yearPart] = match;
  const day = Number(dayPart);
  const month = Number(monthPart);
  let year = Number(yearPart);

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
    return null;
  }

  if (year < 100) {
    year += 2000;
  }

  const parsed = new Date(year, month - 1, day);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getDate() !== day ||
    parsed.getMonth() !== month - 1 ||
    parsed.getFullYear() !== year
  ) {
    return null;
  }

  return parsed;
};

const parseIsoDate = (value = "") => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const createNativeInput = () => {
  const nativeInput = document.createElement("input");
  nativeInput.type = "date";
  nativeInput.className = "date-picker-native-input";
  nativeInput.tabIndex = -1;
  nativeInput.setAttribute("aria-hidden", "true");
  nativeInput.autocomplete = "off";
  return nativeInput;
};

const openPicker = (input) => {
  if (!input) {
    return;
  }
  try {
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
  } catch (error) {
    // showPicker may throw if input is not connected; fallback below
  }

  input.focus({ preventScroll: true });
  input.click();
};

const bindTrigger = (element, callback) => {
  if (!element) {
    return;
  }

  const handle = (event) => {
    event.preventDefault();
    callback();
  };

  element.addEventListener("click", handle);
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  });
};

const initDateField = (field) => {
  if (!field || field.dataset.calendarReady === "true") {
    return;
  }

  const displayInput = field.querySelector(DISPLAY_SELECTOR);
  if (!displayInput) {
    return;
  }

  const trigger = field.querySelector(TRIGGER_SELECTOR) || displayInput;
  const nativeInput = createNativeInput();
  field.appendChild(nativeInput);

  const syncNativeFromDisplay = () => {
    const parsedDisplay = parseDisplayValue(displayInput.value || "");
    nativeInput.value = parsedDisplay ? toIsoDate(parsedDisplay) : "";
  };

  const updateDisplayFromNative = () => {
    const date = parseIsoDate(nativeInput.value);
    if (!date) {
      displayInput.value = "";
      displayInput.removeAttribute("data-value-iso");
      return;
    }

    displayInput.value = formatDisplayDate(date);
    displayInput.setAttribute("data-value-iso", nativeInput.value);
  };

  bindTrigger(trigger, () => {
    syncNativeFromDisplay();
    openPicker(nativeInput);
  });

  nativeInput.addEventListener("change", updateDisplayFromNative);
  displayInput.addEventListener("change", syncNativeFromDisplay);
  displayInput.addEventListener("blur", syncNativeFromDisplay);

  field.dataset.calendarReady = "true";
};

document.addEventListener("DOMContentLoaded", () => {
  const fields = document.querySelectorAll(DATE_FIELD_SELECTOR);
  fields.forEach((field) => initDateField(field));
});

