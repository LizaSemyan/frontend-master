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

const SUBCATEGORY_OPTIONS = {
  Недвижимость: [
    "Здания",
    "Сооружения",
    "Имущественные комплексы",
    "Нежилые помещения",
    "Жилые помещения",
    "Гаражи и машиноместа",
    "Объект незавершенного строительства",
    "Единый недвижимый комплекс",
    "Объект водоснабжения и (или) водоотведения",
    "Объект теплоснабжения",
    "Иной объект недвижимости",
  ],
  "Земельные участки": [
    "Земли сельскохозяйственного назначения",
    "Земли населенных пунктов",
    "Земли специального назначения",
    "Земли особо охраняемых территорий и объектов",
    "Земли лесного фонда",
    "Земли водного фонда",
    "Земельные участки (категория не установлена)",
    "Земельные участки (не образованы)",
  ],
  Транспорт: [
    "Легковые автомобили",
    "Грузовые автомобили",
    "Автобусы",
    "Мототехника",
    "Спецтехника",
    "Водный транспорт",
    "Воздушный транспорт",
    "Запчасти",
    "Годные остатки",
    "Иной транспорт",
  ],
};

const TRADE_FORM_OPTIONS = [
  "Электронный аукцион",
  "Публичное предложение",
  "Продажа без объявления цены",
  "Электронный конкурс",
  "Специализированный аукцион",
  "Прямая продажа",
  "Сообщение о предоставлении (реализации)",
  "Аукцион",
  "Электронный аукцион за долю",
  "Предложение о заключении концессионного соглашения",
  "Конкурс",
  "Публичное предложение (ЗК РФ)",
  "Решение о реализации проекта ГЧП, проекта МЧП",
  "Продажа без объявления цены (цессия)",
  "Публичное предложение (цессия)",
];

const REGION_SELECT_OPEN_CLASS = "region-select--open";
const CUSTOM_SELECT_CHANGE_EVENT = "custom-select:change";
const SELECT_PLACEHOLDER_BY_PREFIX = {
  region: "Регион",
  category: "Категория",
  subcategory: "Подкатегория",
  "trade-form": "Форма проведения торгов",
};

function initCustomSelect(selectEl, { prefix, options = [] }) {
  const query = (name) => selectEl.querySelector(`[data-${prefix}-${name}]`);
  const tagsContainer = query("tags");
  const dropdown = query("options");
  const toggle = query("toggle");
  const placeholderEl = query("placeholder");

  if (!tagsContainer || !dropdown || !toggle) {
    return;
  }

  const fallbackPlaceholder =
    SELECT_PLACEHOLDER_BY_PREFIX[prefix] || "Категория";
  const placeholderText = selectEl.dataset.placeholder || fallbackPlaceholder;
  const removeAttr = `data-${prefix}-remove`;
  const selectedValues = new Map();
  let availableOptions = Array.isArray(options) ? [...options] : [];

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

  const emitChange = () => {
    selectEl.dispatchEvent(
      new CustomEvent(CUSTOM_SELECT_CHANGE_EVENT, {
        detail: {
          values: Array.from(selectedValues.keys()),
          labels: Array.from(selectedValues.values()),
        },
      })
    );
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

  const buildOption = (label) => {
    const optionBtn = document.createElement("button");
    optionBtn.type = "button";
    optionBtn.className = "region-option";
    optionBtn.dataset.value = label;
    optionBtn.setAttribute("aria-pressed", "false");
    optionBtn.textContent = label;
    return optionBtn;
  };

  const populateOptions = (list) => {
    dropdown.innerHTML = "";
    list.forEach((option) => {
      dropdown.appendChild(buildOption(option));
    });
    selectedValues.forEach((_, value) => {
      setOptionState(value, true);
    });
  };

  const closeDropdown = () => {
    selectEl.classList.remove(REGION_SELECT_OPEN_CLASS);
    toggle.setAttribute("aria-expanded", "false");
  };

  const openDropdown = () => {
    if (!dropdown.children.length) {
      return;
    }
    selectEl.classList.add(REGION_SELECT_OPEN_CLASS);
    toggle.setAttribute("aria-expanded", "true");
  };

  const toggleDropdown = () => {
    if (!dropdown.children.length) {
      return;
    }
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
    emitChange();
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
    emitChange();
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

  populateOptions(availableOptions);
  renderTags();

  const setOptions = (list = []) => {
    availableOptions = Array.isArray(list) ? [...list] : [];
    closeDropdown();
    populateOptions(availableOptions);

    const valuesToDelete = [];
    selectedValues.forEach((_, value) => {
      if (!availableOptions.includes(value)) {
        valuesToDelete.push(value);
      }
    });

    valuesToDelete.forEach((value) => {
      selectedValues.delete(value);
    });

    if (valuesToDelete.length > 0) {
      renderTags();
    } else {
      updatePlaceholder();
    }

    emitChange();
  };

  const clearSelection = () => {
    if (!selectedValues.size) {
      return;
    }
    selectedValues.clear();
    renderTags();
    emitChange();
  };

  const api = {
    getValues: () => Array.from(selectedValues.keys()),
    setOptions,
    clear: clearSelection,
  };

  selectEl.customSelect = api;
  return api;
}

document.addEventListener("DOMContentLoaded", () => {
  const initSelectGroup = (selector, config) =>
    Array.from(document.querySelectorAll(selector))
      .map((selectEl) => ({
        element: selectEl,
        instance: initCustomSelect(selectEl, config),
      }))
      .filter(({ instance }) => Boolean(instance));

  initSelectGroup("[data-region-select]", {
    prefix: "region",
    options: REGION_OPTIONS,
  });

  const categorySelects = initSelectGroup("[data-category-select]", {
    prefix: "category",
    options: CATEGORY_OPTIONS,
  });

  const subcategorySelects = initSelectGroup("[data-subcategory-select]", {
    prefix: "subcategory",
    options: [],
  });

  if (categorySelects.length && subcategorySelects.length) {
    const buildSubcategoryOptions = (categories) => {
      if (!categories.length) {
        return [];
      }

      const result = [];
      const seen = new Set();

      categories.forEach((category) => {
        const options = SUBCATEGORY_OPTIONS[category] || [];
        options.forEach((option) => {
          if (seen.has(option)) {
            return;
          }
          seen.add(option);
          result.push(option);
        });
      });

      return result;
    };

    const syncSubcategories = (categories) => {
      const nextOptions = buildSubcategoryOptions(categories);
      subcategorySelects.forEach(({ instance }) => {
        instance.setOptions(nextOptions);
      });
    };

    categorySelects.forEach(({ element }) => {
      element.addEventListener(CUSTOM_SELECT_CHANGE_EVENT, (event) => {
        const categories = event.detail?.values || [];
        syncSubcategories(categories);
      });
    });
  }

  initSelectGroup("[data-trade-form-select]", {
    prefix: "trade-form",
    options: TRADE_FORM_OPTIONS,
  });
});

