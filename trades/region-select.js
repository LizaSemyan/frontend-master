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

const REGION_SELECT_OPEN_CLASS = "region-select--open";

function initRegionSelect(selectEl) {
  const tagsContainer = selectEl.querySelector("[data-region-tags]");
  const dropdown = selectEl.querySelector("[data-region-options]");
  const toggle = selectEl.querySelector("[data-region-toggle]");
  const placeholderEl = selectEl.querySelector("[data-region-placeholder]");

  if (!tagsContainer || !dropdown || !toggle) {
    return;
  }

  const placeholderText = selectEl.dataset.placeholder || "Регион";
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
      removeBtn.dataset.regionRemove = "true";
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
    const removeBtn = event.target.closest("[data-region-remove]");
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

  REGION_OPTIONS.forEach((city) => {
    const optionBtn = document.createElement("button");
    optionBtn.type = "button";
    optionBtn.className = "region-option";
    optionBtn.dataset.value = city;
    optionBtn.setAttribute("aria-pressed", "false");
    optionBtn.textContent = city;
    dropdown.appendChild(optionBtn);
  });

  renderTags();
  updatePlaceholder();
}

document.addEventListener("DOMContentLoaded", () => {
  const regionSelects = document.querySelectorAll("[data-region-select]");
  regionSelects.forEach((selectEl) => initRegionSelect(selectEl));
});

