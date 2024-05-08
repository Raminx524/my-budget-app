const exKEY = "expenses";
const inKEY = "incomes";
const incomeArr = intializeArrayFromLocalStorage(inKEY);
const expensesArr = intializeArrayFromLocalStorage(exKEY);
firstRender();
handleDateHeader();
document.querySelector(".fa-circle-check").addEventListener("click", () => {
  const itemDescription = document.querySelector("#descInput").value;
  const itemValue = +Number.parseFloat(document.querySelector("#valInput").value).toFixed(2);
  const operator = document.querySelector("#valueOperation").value;
  const isValid = isInfoValid(itemDescription, itemValue);
  if (isValid) {
    document.querySelector("#errorDisplay").innerText = "";
    pushToCorrectArray(
      { description: itemDescription, value: itemValue },
      operator
    );
    const transactionsSums = calcSums();
    createDOMHistoryItems(operator, transactionsSums[1]);
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
    return result <= 0 ? `${result}.00` : `${result}.00`;
  }
  return +Number.parseFloat(result).toFixed(2);
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

function createDOMHistoryItems(operator, expensesSum) {
  let activeArrElems = [];
  if (operator === "+") {
    let index = 0;
    activeArrElems = incomeArr.map((itemObj) => {
      return `<div class="historyItem" id="incomeItem${index}">
            <p>${itemObj.description}</p><div>+${formatPretty(itemObj.value)}</div>
            <i class="fa-thin fa-circle-xmark" onclick="removeItem(${index++},'income')"></i>
            </div>`;
    });
    document.querySelector("#dynamicIncomesContainer").innerHTML =
      activeArrElems.join("");
  } else {
    let index = 0;
    activeArrElems = expensesArr.map((itemObj) => {
      return `<div class="historyItem" id="expensesItem${index}">
            <p>${
              itemObj.description
            }</p><div class="wrapperHistoryItems"><div>-${formatPretty(itemObj.value)}</div>
            <span class="precentagesHistory">${Math.round(
              (itemObj.value / expensesSum) * 100
            )}%</span>
            <i class= "fa-light fa-circle-xmark" onclick="removeItem(${index++},'expenses')"></i></div></div>`;
    });
    document.querySelector("#dynamicExpensesContainer").innerHTML =
      activeArrElems.join("");
  }
}

function removeItem(index, idStr) {
  document.querySelector(`#${idStr}Item${index}`).remove();
  removeFromCorrectArray(idStr, index);
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

function updateLocalStorage(KEY){
    localStorage.setItem(KEY,JSON.stringify(KEY==="incomes"? incomeArr : expensesArr));
}

function intializeArrayFromLocalStorage(KEY){
    if(localStorage.getItem(KEY)){
        return JSON.parse(localStorage.getItem(KEY));
    }
    return [];
}

function firstRender(){
    if(incomeArr.length == 0 && expensesArr.length == 0){
        document.querySelector("#sumDisplayIncomes").innerText = Number.parseFloat(0.00).toFixed(2);
        document.querySelector("#sumDisplayExpenses").innerText = Number.parseFloat(0.00).toFixed(2);
        document.querySelector(".currentBalance").innerText = Number.parseFloat(0.00).toFixed(2);
    }
    else{
        if(incomeArr.length == 0){
            const transactionsSums = calcSums();
            createDOMHistoryItems("-", transactionsSums[1]);
            renderInfo(0,transactionsSums[1]);
        }
        else if(expensesArr.length == 0){
            const transactionsSums = calcSums();
            createDOMHistoryItems("+", 0);
            renderInfo(transactionsSums[0], 0);
        }
        else{
            const transactionsSums = calcSums();
            createDOMHistoryItems("+", transactionsSums[1]);
            createDOMHistoryItems("-", transactionsSums[1]);
            renderInfo(...transactionsSums);
        }
    }
}
