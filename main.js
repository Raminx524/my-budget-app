const exKEY = "expenses";
const inKEY = "incomes";
const incomeArr = initializeArrayFromLocalStorage(inKEY);
const expensesArr = initializeArrayFromLocalStorage(exKEY);
let inputOutlineColor = "#32a5a0";
document.querySelector("#valInput").addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    //for enter key ascii code
    document.querySelector(".fa-circle-check").click();
  }
});
firstRender();
handleDateHeader();
document.querySelector(".fa-circle-check").addEventListener("click", () => {
  const itemDescription = document.querySelector("#descInput").value;
  const itemValue = +Number.parseFloat(
    document.querySelector("#valInput").value
  ).toFixed(2);
  const operator = document.querySelector("#valueOperation").value;
  const isValid = isInfoValid(itemDescription, itemValue);
  if (isValid) {
    document.querySelector("#errorDisplay").innerText = "";
    pushToCorrectArray(
      { description: itemDescription, value: itemValue },
      operator
    );
    const transactionsSums = calcSums();
    createDOMHistoryItems(operator, transactionsSums[0]);
    renderInfo(...transactionsSums);
  }
});

function isInfoValid(desc, val) {
  const errorDisplay = document.querySelector("#errorDisplay");
  if (desc === "" || val === "") {
    errorDisplay.innerText = "Please fill out all fields!";
    return false;
  }
  if (isNaN(val)) {
    errorDisplay.innerText = "Value must be a number!";
    return false;
  }
  if (val <= 0) {
    errorDisplay.innerText = "Value must be higher than 0!";
    return false;
  }
  return true;
}

function pushToCorrectArray(infoObj, operator) {
  if (operator === "+") {
    incomeArr.push(infoObj);
    updateLocalStorage(inKEY);
  } else {
    expensesArr.push(infoObj);
    updateLocalStorage(exKEY);
  }
}

function calcSums() {
  let incomeSum = incomeArr.reduce((total, obj) => total + obj.value, 0);
  let expensesSum = expensesArr.reduce((total, obj) => total + obj.value, 0);
  return [incomeSum, expensesSum];
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
  }
}

function formatPretty(result) {
  if (result % 1 == 0) {
    return result <= 0
      ? `${result.toLocaleString()}.00`
      : `${result.toLocaleString()}.00`;
  }
  return +Number.parseFloat(result.toLocaleString()).toFixed(2);
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

function createDOMHistoryItems(operator, incomeSum) {
  let activeArrElems = [];
  if (operator === "+") {
    let index = 0;
    activeArrElems = incomeArr.map((itemObj) => {
      return `<div class="historyItem incomeHistoryItems" id="incomeItem${index}">
            <p>${
              itemObj.description
            }</p><div class="historyItemValuesContainer"><div>+${formatPretty(
        itemObj.value
      )}</div>
            <i class="fa-regular fa-circle-xmark xMark" onclick="removeItem(${index++},'income')"></i></div>
            </div>`;
    });
    document.querySelector("#dynamicIncomesContainer").innerHTML =
      activeArrElems.join("");
  } else {
    let index = 0;
    activeArrElems = expensesArr.map((itemObj) => {
      return `<div class="historyItem expensesHistoryItems" id="expensesItem${index}">
            <p>${
              itemObj.description
            }</p><div class="historyItemValuesContainer"><div>-${formatPretty(
        itemObj.value
      )}</div>
            <span class="precentagesHistory">${Math.round(
              (itemObj.value / incomeSum) * 100
            )}%</span>
            <i class= "fa-regular fa-circle-xmark xMark" onclick="removeItem(${index++},'expenses')"></i></div></div>`;
    });
    document.querySelector("#dynamicExpensesContainer").innerHTML =
      activeArrElems.join("");
  }
}

function removeItem(index, idStr) {
  document.querySelector(`#${idStr}Item${index}`).remove();
  removeFromCorrectArray(idStr, index);
  const transactionsSums = calcSums();
  renderInfo(...transactionsSums);
}

function removeFromCorrectArray(idStrParam, i) {
  if (idStrParam === "income") {
    incomeArr.splice(i, 1);
    updateLocalStorage(inKEY);
  } else {
    expensesArr.splice(i, 1);
    updateLocalStorage(exKEY);
  }
}

function updateLocalStorage(KEY) {
  localStorage.setItem(
    KEY,
    JSON.stringify(KEY === "incomes" ? incomeArr : expensesArr)
  );
}

function initializeArrayFromLocalStorage(KEY) {
  if (localStorage.getItem(KEY)) {
    return JSON.parse(localStorage.getItem(KEY));
  }
  return [];
}

function firstRender() {
  if (incomeArr.length == 0 && expensesArr.length == 0) {
    document.querySelector("#sumDisplayIncomes").innerText =
      Number.parseFloat(0.0).toFixed(2);
    document.querySelector("#sumDisplayExpenses").innerText =
      Number.parseFloat(0.0).toFixed(2);
    document.querySelector(".currentBalance").innerText =
      Number.parseFloat(0.0).toFixed(2);
  } else {
    if (incomeArr.length == 0) {
      const transactionsSums = calcSums();
      createDOMHistoryItems("-", transactionsSums[1]);
      renderInfo(0, transactionsSums[1]);
    } else if (expensesArr.length == 0) {
      const transactionsSums = calcSums();
      createDOMHistoryItems("+", 0);
      renderInfo(transactionsSums[0], 0);
    } else {
      const transactionsSums = calcSums();
      createDOMHistoryItems("+", transactionsSums[0]);
      createDOMHistoryItems("-", transactionsSums[0]);
      renderInfo(...transactionsSums);
    }
  }
}

function changeInputStyleBasedOnOperator(elem) {
  inputOutlineColor = elem.value === "+" ? "#32a5a0" : "#f53237";
  document.querySelector("#descInput").style["outline-color"] =
    inputOutlineColor;
  document.querySelector(".fa-circle-check").style.color = inputOutlineColor;
  document.querySelector("#valInput").style["outline-color"] =
    inputOutlineColor;
  elem.style["outline-color"] = inputOutlineColor;
}

function applyBorderStyle(opSelectElem) {
  opSelectElem.style.border = `2px solid ${inputOutlineColor}`;
}

function removerBorderStyle(opSelectElem) {
  opSelectElem.style.border = "1px solid rgb(219, 219, 219)";
}
