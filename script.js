const tabs = Array.from(document.querySelectorAll("[data-filter]"));
const cards = Array.from(document.querySelectorAll("[data-course]"));
const choiceButtons = Array.from(document.querySelectorAll("[data-choice]"));
const selectionCount = document.querySelector("[data-selection-count]");
const selectionCost = document.querySelector("[data-selection-cost]");
const billDialog = document.querySelector(".bill-dialog");
const billLines = document.querySelector("[data-bill-lines]");
const billTotal = document.querySelector("[data-bill-total]");
const billNote = document.querySelector("[data-bill-note]");
const toast = document.querySelector(".toast");
const selected = new Set();
const tipButtons = Array.from(document.querySelectorAll("[data-tip]"));

let toastTimer = 0;
let selectedTip = "обійми";

const priceTiers = [
  {
    count: 0,
    short: "вартість: бронь",
    total: "Бронь вечора вже активна",
    note: "Обери кілька позицій, і рахунок стане цікавішим."
  },
  {
    count: 1,
    short: "вартість: 1 комплімент",
    total: "1 чесний комплімент",
    note: "Подається без поспіху і без жодного жарту, який зіпсує момент."
  },
  {
    count: 2,
    short: "вартість: комплімент + поцілунок",
    total: "1 комплімент + 1 поцілунок",
    note: "Класичний сет для старту вечора. Рекомендовано з Bellini."
  },
  {
    count: 3,
    short: "вартість: 2 поцілунки",
    total: "2 поцілунки + Настя обирає пісню",
    note: "Плейлист переходить під контроль гості вечора."
  },
  {
    count: 4,
    short: "вартість: обійми + slow dance",
    total: "2 поцілунки + 1 довгі обійми + slow dance",
    note: "Сервісний збір: телефон відкладається екраном вниз."
  },
  {
    count: 5,
    short: "вартість: full romantic tasting",
    total: "3 поцілунки + slow dance + десерт-сюрприз",
    note: "Десерт-сюрприз може бути солодким, а може бути ще кращим планом після вечері."
  },
  {
    count: 6,
    short: "вартість: весь вечір для Насті",
    total: "5 поцілунків + 2 обійми + весь вечір для Насті",
    note: "Максимальний тариф. Повернення коштів не передбачене, бо все вже дуже добре."
  }
];

const linePrices = [
  "усмішка",
  "погляд",
  "комплімент",
  "поцілунок",
  "обійми",
  "пісня від Насті",
  "slow dance",
  "секретний десерт"
];

const romanticDeck = [
  "Місія: між starter і main сказати Насті, що сьогодні в ній найкрасивіше.",
  "Місія: Настя обирає одну пісню, а Назар не сперечається з вибором.",
  "Місія: 30 секунд дивитися одне на одного без телефону. Хто перший засміявся, той наливає.",
  "Місія: придумати назву для цієї вечері, ніби це справжній ресторанний pop-up.",
  "Місія: після signature dish зробити маленький тост за вашу традицію."
];

const declension = (count) => {
  if (count === 1) return "1 позиція";
  if (count > 1 && count < 5) return `${count} позиції`;
  return `${count} позицій`;
};

const showToast = (message) => {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.setAttribute("aria-hidden", "false");
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.setAttribute("aria-hidden", "true");
  }, 2800);
};

const renderBill = () => {
  const tier = priceTiers[Math.min(selected.size, priceTiers.length - 1)];
  selectionCount.textContent = declension(selected.size);
  selectionCost.textContent = tier.short;
  billTotal.textContent = selected.size > 0 ? `${tier.total} + чайові: ${selectedTip}` : tier.total;
  billNote.textContent = tier.note;

  if (selected.size === 0) {
    billLines.innerHTML = "<p>Поки що вибір порожній. Але вечір уже заброньований.</p>";
    return;
  }

  billLines.innerHTML = Array.from(selected)
    .map((item, index) => `<div class="bill-line"><span>${item}</span><strong>${linePrices[index % linePrices.length]}</strong></div>`)
    .join("");
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;
    tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    cards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.course === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const choice = button.dataset.choice;
    const isSelected = selected.has(choice);

    if (isSelected) {
      selected.delete(choice);
      button.textContent = "Обрати";
      showToast(`${choice} прибрано з вибору вечора`);
    } else {
      selected.add(choice);
      button.textContent = "Обрано";
      showToast(`${choice} додано до вибору вечора`);
    }

    button.classList.toggle("is-selected", !isSelected);
    renderBill();
  });
});

document.querySelectorAll("[data-note]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(button.dataset.note);
  });
});

document.querySelectorAll("[data-random-note]").forEach((button) => {
  button.addEventListener("click", () => {
    const note = romanticDeck[Math.floor(Math.random() * romanticDeck.length)];
    showToast(note);
  });
});

tipButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedTip = button.dataset.tip;
    tipButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderBill();
    showToast(`Чайові змінено: ${selectedTip}`);
  });
});

document.querySelectorAll("[data-open-bill]").forEach((button) => {
  button.addEventListener("click", () => {
    renderBill();
    if (typeof billDialog.showModal === "function") {
      billDialog.showModal();
    } else {
      showToast("До сплати: 1 поцілунок, 1 обійми і 1 slow dance.");
    }
  });
});

document.querySelector("[data-close-bill]").addEventListener("click", () => {
  billDialog.close();
});

document.querySelector("[data-pay]").addEventListener("click", () => {
  billDialog.close();
  showToast(`Оплату прийнято. Чайові офіціанту: ${selectedTip}.`);
});

renderBill();
