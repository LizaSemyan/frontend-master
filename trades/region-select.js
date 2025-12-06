const REGION_OPTIONS = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Нижний Новгород",
  "Казань",
  "Челябинск",
  "Омск",
  "Самара",
  "Ростов-на-Дону",
];

const CATEGORY_OPTIONS = [
  "Недвижимость",
  "Земельные участки",
  "Транспорт",
];

const REGION_SELECT_OPEN_CLASS = "region-select--open";

function initCustomSelect(selectEl, { prefix, options }) {
  const query = (name) => selectEl.querySelector(`[data-${prefix}-${name}]`);
  const tagsContainer = query("tags");
  const dropdown = query("options");
  const toggle = query("toggle");
  const placeholderEl = query("placeholder");

  if (!tagsContainer || !dropdown || !toggle) {
    return;
  }

  const fallbackPlaceholder = prefix === "region" ? "Регион" : "Категория";
  const placeholderText = selectEl.dataset.placeholder || fallbackPlaceholder;
  const removeAttr = `data-${prefix}-remove`;
  const selectedValues = new Map();

  const updatePlaceholder = () => {
    if (!placeholderEl) {
      return;
    }
    placeholderEl.textContent = placeholderText;
    placeholderEl.hidden = selectedValues.size > 0;
  };

  const setOptionState = (value, isSelected) => {
    const optionBtn = dropdown.querySelector(`[data-value="${value}"]`);
    if (optionBtn) {
      optionBtn.classList.toggle("is-selected", isSelected);
      optionBtn.setAttribute("aria-pressed", isSelected ? "true" : "false");
    }
  };

  const renderTags = () => {
    tagsContainer.querySelectorAll(".region-tag").forEach((tag) => tag.remove());

    selectedValues.forEach((label, value) => {
      const tag = document.createElement("span");
      tag.className = "region-tag";
      tag.dataset.value = value;
      tag.textContent = label;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "region-tag__remove";
      removeBtn.setAttribute("aria-label", `Удалить ${label}`);
      removeBtn.innerHTML = "&times;";
      removeBtn.setAttribute(removeAttr, "true");
      tag.appendChild(removeBtn);

      tagsContainer.insertBefore(tag, placeholderEl || null);
    });

    updatePlaceholder();
  };

  const openDropdown = () => {
    selectEl.classList.add(REGION_SELECT_OPEN_CLASS);
    toggle.setAttribute("aria-expanded", "true");
  };

  const closeDropdown = () => {
    selectEl.classList.remove(REGION_SELECT_OPEN_CLASS);
    toggle.setAttribute("aria-expanded", "false");
  };

  const toggleDropdown = () => {
    if (selectEl.classList.contains(REGION_SELECT_OPEN_CLASS)) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const handleOptionClick = (event) => {
    const optionBtn = event.target.closest("button[data-value]");
    if (!optionBtn) {
      return;
    }

    event.preventDefault();
    const value = optionBtn.dataset.value;
    if (!value) {
      return;
    }

    if (selectedValues.has(value)) {
      selectedValues.delete(value);
      setOptionState(value, false);
    } else {
      selectedValues.set(value, optionBtn.textContent.trim());
      setOptionState(value, true);
    }

    renderTags();
  };

  const handleRemoveClick = (event) => {
    const removeBtn = event.target.closest(`[${removeAttr}]`);
    if (!removeBtn) {
      return;
    }
    event.stopPropagation();

    const tag = removeBtn.closest(".region-tag");
    if (!tag) {
      return;
    }

    const value = tag.dataset.value;
    if (!value) {
      return;
    }

    selectedValues.delete(value);
    setOptionState(value, false);
    renderTags();
  };

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    toggleDropdown();
  });

  toggle.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      toggleDropdown();
    } else if (event.key === "Escape") {
      closeDropdown();
    }
  });

  dropdown.addEventListener("click", handleOptionClick);
  tagsContainer.addEventListener("click", handleRemoveClick);

  document.addEventListener("click", (event) => {
    if (!selectEl.contains(event.target)) {
      closeDropdown();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdown();
    }
  });

  options.forEach((option) => {
    const optionBtn = document.createElement("button");
    optionBtn.type = "button";
    optionBtn.className = "region-option";
    optionBtn.dataset.value = option;
    optionBtn.setAttribute("aria-pressed", "false");
    optionBtn.textContent = option;
    dropdown.appendChild(optionBtn);
  });

  renderTags();
  updatePlaceholder();
}

document.addEventListener("DOMContentLoaded", () => {
  const selectConfigs = [
    { prefix: "region", options: REGION_OPTIONS },
    { prefix: "category", options: CATEGORY_OPTIONS },
  ];

  selectConfigs.forEach((config) => {
    document
      .querySelectorAll(`[data-${config.prefix}-select]`)
      .forEach((selectEl) => initCustomSelect(selectEl, config));
  });
});

