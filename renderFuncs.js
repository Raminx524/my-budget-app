function firstRender() {
  if (incomeArr.length == 0 && expensesArr.length == 0) {
    document.querySelector("#sumDisplayIncomes").innerText =
      Number.parseFloat(0.0).toFixed(2);
    document.querySelector("#sumDisplayExpenses").innerText =
      Number.parseFloat(0.0).toFixed(2);
    document.querySelector(".currentBalance").innerText =
      Number.parseFloat(0.0).toFixed(2);
  } else {
    const transactionsSums = calcSums();
    if (incomeArr.length == 0) {
      createDOMHistoryItems("-", ...transactionsSums);
      renderInfo(0, transactionsSums[1]);
    } else if (expensesArr.length == 0) {
      createDOMHistoryItems("+", ...transactionsSums);
      renderInfo(transactionsSums[0], 0);
    } else {
      createDOMHistoryItems("+", ...transactionsSums);
      createDOMHistoryItems("-", ...transactionsSums);
      renderInfo(...transactionsSums);
    }
  }
}

function renderInfo(income, expenses) {
  const balanceResult = income - expenses;
  const incomeInnerText = formatPretty(income);
  const expensesInnerText = formatPretty(expenses);
  const balanceInnerText = formatPretty(balanceResult);
  document.querySelector("#sumDisplayIncomes").innerText =
    income == 0 ? incomeInnerText : `+ ${incomeInnerText}`;
  document.querySelector("#sumDisplayExpenses").innerText =
    expenses == 0 ? expensesInnerText : `- ${expensesInnerText}`;
  document.querySelector(".currentBalance").innerText =
    balanceResult > 0 ? `+${balanceInnerText}` : balanceInnerText;
  if (expenses !== 0 && income !== 0) {
    document.querySelector("#percentages").innerText = `${Math.round(
      (expenses / income) * 100
    )}%`;
  } else if (income === 0 && expenses !== 0) {
    document.querySelector("#percentages").innerText = `100%`;
  } else if (expenses === 0 && income !== 0) {
    document.querySelector("#percentages").innerText = `0%`;
  }
}
function handleDateHeader() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDate = new Date();
  let month = currentDate.getUTCMonth();
  let year = currentDate.getUTCFullYear();
  const monthStr = monthNames[month];
  document.querySelector("h1").innerText += ` ${monthStr} ${year}`;
}

function createDOMHistoryItems(operator, incomeSum, expensesSum) {
  let activeArrElems = [];
  if (operator === "+") {
    activeArrElems = incomeArr.map((itemObj) => {
      return `<div class="historyItem incomeHistoryItems">
              <p>${
                itemObj.description
              }</p><div class="historyItemValuesContainer"><div>+${formatPretty(
        itemObj.value
      )}</div>
              <i class="fa-regular fa-circle-xmark xMark" onclick="removeItem(this,'income')"></i></div>
              </div>`;
    });
    document.querySelector("#dynamicIncomesContainer").innerHTML =
      activeArrElems.join("");
  } else {
    activeArrElems = expensesArr.map((itemObj) => {
      return `<div class="historyItem expensesHistoryItems">
              <p>${
                itemObj.description
              }</p><div class="historyItemValuesContainer"><div>-${formatPretty(
        itemObj.value
      )}</div>
              <span class="precentagesHistory">${
                incomeSum != 0
                  ? Math.round((itemObj.value / incomeSum) * 100)
                  : Math.round((itemObj.value / expensesSum) * 100)
              }%</span>
              <i class= "fa-regular fa-circle-xmark xMark" onclick="removeItem(this,'expenses')"></i></div></div>`;
    });
    document.querySelector("#dynamicExpensesContainer").innerHTML =
      activeArrElems.join("");
  }
}
