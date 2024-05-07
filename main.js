const incomeArr = [];
const expensesArr = [];
document.querySelector(".fa-circle-check").addEventListener("click", () => {
  const itemDescription = document.querySelector("#descInput").value;
  const itemValue = document.querySelector("#valInput").value;
  const operator = document.querySelector("#valueOperation").value;
  const isValid = isInfoValid(itemDescription,itemValue);
  if(isValid){
    pushToCorrectArray({description: itemDescription, value: +itemValue}, operator);
    const transactionsSums = calcSums();
    renderInfo(...transactionsSums);
  }
});

function isInfoValid(desc, val){
    const errorDisplay = document.querySelector("#errorDisplay");
    if (desc === "" || val === "") {
        errorDisplay.innerText = "Please fill out all fields!";
        return false;
    }
    if(isNaN(val)) {
        errorDisplay.innerText = "Value must be a number!";
        return false;
    }
    if(val <= 0) {
        errorDisplay.innerText = "Value must be higher than 0!";
        return false;
    }
    return true;    
}

function pushToCorrectArray(infoObj, op){
    if(op === "+"){
        incomeArr.push(infoObj);
    }
    else{
        expensesArr.push(infoObj);
    }
}
function calcSums(){
    const incomeSum = incomeArr.reduce((total, obj)=> total + obj.value, 0);
    const expensesSum = expensesArr.reduce((total, obj)=> total + obj.value, 0);
    return [incomeSum, expensesSum];
}

function renderInfo(income, expenses){
    document.querySelector("#sumDisplayIncomes").innerText = income;
    document.querySelector("#sumDisplayExpenses").innerText = expenses;
    document.querySelector("#percentages").innerText = `${(expenses/income)*100}%`;
    //change infinity bug in display
    document.querySelector(".currentBalance").innerText = income-expenses;
}
