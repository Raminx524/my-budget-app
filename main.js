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
    createDOMHistoryItems(operator, ...transactionsSums);
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

function formatPretty(result) {
  if (result % 1 == 0) {
    return `${result.toLocaleString()}.00`;
  }
  return +Number.parseFloat(result.toLocaleString()).toFixed(2);
}

function removeItem(btnElem, idStr) {
  const elemIndex = getElemIndexInArray(btnElem, idStr);
  btnElem.parentNode.parentNode.remove();
  removeFromCorrectArray(idStr, elemIndex);
  location.reload();
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

function getElemIndexInArray(btnTargetElem, idStrParam) {
  let indexResult;
  if (idStrParam === "income") {
    const historyItemsElems = document.querySelectorAll(".incomeHistoryItems");
    historyItemsElems.forEach((item, i) => {
      if (item.children[1].children[1] === btnTargetElem) {
        indexResult = i;
      }
    });
  } else {
    const historyItemsElems = document.querySelectorAll(
      ".expensesHistoryItems"
    );
    historyItemsElems.forEach((item, i) => {
      if (item.children[1].children[2] === btnTargetElem) {
        indexResult = i;
      }
    });
  }
  return indexResult;
}
