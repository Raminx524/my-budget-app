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