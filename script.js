const $ = (selector) => document.querySelector(selector);
const $$ = (selectors) => document.querySelectorAll(selectors);

const $btnAdd = $("#btn-add");
const $categories = $("#container-categories");
const $newCategories = $("#categorie");
const $tableCategories = $("#table-categories");
const btnEdit = $$(".btn-edit");
const btnDelete = $$(".btn-delete");


const generateID = () => {
  let length = 4
  let characters = "0123456789"
  let idObtained = "";
  for (let i = 0, n = characters.length; i < length; ++i) {
    idObtained += characters.charAt(Math.floor(Math.random() * n));
  }
  return idObtained;
}

let defaultCategories = [
  { id: 1, nombre:"Comida" },
  { id: 2, nombre:"Servicios" },
  { id: 3, nombre:"Salidas" },
  { id: 4, nombre:"Educacion" },
  { id: 5, nombre:"Trabajo" },
];

// FUNCTONS LOCALSTORAGE

let categories = localStorage.getItem("categories")
  ? JSON.parse(localStorage.getItem("categories"))
  : defaultCategories;

if (!localStorage.getItem("categories")) {
  localStorage.setItem("categories", JSON.stringify(categories));
}
const getDataFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
const sendDataFromLocalStorage = (key, array) => {
  return localStorage.setItem(key, JSON.stringify(array));
};

// DATE FUNCTIONS

let day = new Date();
$("#dateOperation").value =
  day.getFullYear() +
  "-" +
  ("0" + (day.getMonth() + 1)).slice(-2) +
  "-" +
  ("0" + day.getDate()).slice(-2);

const formatDate = (day) => {
  const newDate = day.split("-").reverse();
  return newDate.join("-");
};

// ****************************GENERATE TABLE & REMOVE*****************************
const generateTable = (categories) => {
  for (const category of categories) {
    table.innerHTML += `
    <tr class="w-[20%] h-10 mb-5 categoryColumn"  >
                        <th class="w-[80%] text-start mb-3">${(category.id, category.nombre)
      }</th>
                        <th scope="col"><button class= "mr-3 btn-edit text-green-500 lg:text-[18px]" data-id="${category.id
      }" onclick="categoriesEdit(${category.id
      })">Editar</button></th>
                        <th scope="col"> <button class= "btnRemove text-red-500 lg:text-[18px]" data-id="${category.id
      }">Eliminar</button></th>
            </tr>
               `;
  }

  const btnRemove = $$(".btnRemove");
  for (const btn of btnRemove) {
    const categoryId = btn.getAttribute("data-id");
    btn.addEventListener("click", () => {
      $("#container-categories").classList.add("hidden")
      $("#alertDelete").classList.remove("hidden")
      $("#submit-delete").setAttribute("data-id", categoryId)
    });
  }
};

$("#submit-delete").addEventListener("click", () => {
  $("#container-categories").classList.remove("hidden")
  $("#alertDelete").classList.add("hidden")
  const categoryId = $("#submit-delete").getAttribute("data-id")
  const removeCategoryInOperations = getDataFromLocalStorage('categories').filter(category => category.id === parseInt(categoryId));
  deleteCategory(categoryId)

  
  const operations = getDataFromLocalStorage('operations')
  .filter(operation => operation.selectCategoryOperation !== removeCategoryInOperations[0].nombre);

sendDataFromLocalStorage("operations", operations)
})

generateTable(JSON.parse(localStorage.getItem("categories")));


// ***************************GENERATE NEW CATEGORY**************************

const categoryInfo = () => {
  const nombre = $("#addCategory").value;
  let id = parseInt(generateID());
  return {
    id,
    nombre,
  };
};

const generateNewCategory = () => {
  if ($("#addCategory").value === "") {
    return alert("Debe ingresar un nombre para la categoría");
  } else {
    table.innerHTML = "";
    categories.push(categoryInfo());
    $("#addCategory").value = "";
    localStorage.setItem("categories", JSON.stringify(categories));
    generateTable(JSON.parse(localStorage.getItem("categories")));
  }
};

$btnAdd.addEventListener("click", generateNewCategory);

$("#addCategory").addEventListener("keypress", (e) => {
  if (e.keyCode == "13") {
    generateNewCategory();
  }
});

// *************************DELETE CATEGORY**************************

const deleteCategory = (categoryId) => {
  table.innerHTML = "";
  let categoriesLocal = JSON.parse(localStorage.getItem("categories"));
  let newCategories = categoriesLocal.filter((category) => {
    console.log(categoryId)
    return category.id !== parseInt(categoryId);
  });

  categories = newCategories;
  localStorage.setItem("categories", JSON.stringify(newCategories));
  generateTable(JSON.parse(localStorage.getItem("categories")));
};

const findCategory = (id) => {
  return categories.find((category) => category.id === id);
};

// *********************EDIT & CANCEL***********************

const categoriesEdit = (id) => {
  $("#container-categories").classList.add("hidden");
  $("#container-edit-categories").classList.remove("hidden");
  const selectCategory = findCategory(id);
  $("#editName").value = `${selectCategory.nombre}`;
  $("#btn-editForm").setAttribute("data-id", id);
  $("#btn-cancel").setAttribute("data-id", id);
};

const saveCategoryData = (id) => {
  return {
    id,
    nombre: $("#editName").value,
  };
};

const editCategory = (id) => {
  return categories.map((category) => {
    if (category.id === parseInt(id)) {
      return saveCategoryData(parseInt(id));
    }
    return category;
  });
};

$("#btn-editForm").addEventListener("click", () => {
  const categoriesId = $("#btn-editForm").getAttribute("data-id");
  $("#container-edit-categories").classList.add("hidden");
  $("#container-categories").classList.remove("hidden");
  $("#table").innerHTML = "";
  let categoriesEdit = editCategory(parseInt(categoriesId));
  localStorage.setItem("categories", JSON.stringify(categoriesEdit));
  categories = categoriesEdit;
  generateTable(JSON.parse(localStorage.getItem("categories")));
});

// ***********************************OPERATIONS*****************************************

let operationsDefault = [];

let operations = localStorage.getItem("operations")
  ? JSON.parse(localStorage.getItem("operations"))
  : operationsDefault;

if (!localStorage.getItem("operations")) {
  localStorage.setItem("operations", JSON.stringify(operations));
}

const btnEditOp = $$(".editOperation");
const generateOperationTable = (operations) => {
  $("#tableContainer").innerHTML = "";
  operations.map((operation) => {
    $("#tableContainer").innerHTML += `
                <table class=" w-full">
                <tr class="w-full font-bold text-center">
                <td class="w-1/5 font-bold text-[12px] lg:text-[14px]"> ${operation.descriptionOperation
      }</td>
                <td class="w-1/5 font-bold hidden"> ${operation.ids}</td>
                    <td class="w-1/5 mr-3 btn-edit text-green-500 text-[12px]">${operation.selectCategoryOperation
      }</td>
                    <td class="w-1/5 text-[10px]">${formatDate(operation.dateOperation)}
                    </td>
                    <td class="w-1/5  ${operation.operationType === "gain"
        ? "text-green-600 text-[10px]"
        : "text-red-600 text-[10px]"
      }">${operation.operationType === "spending" ? "-" : "+"}$${operation.amountOperation
}</td>
                    <td class="w-1/5 space-y-1 flex-row space-x-2 items-center text-blue-700 ml-[40%]"> <button class="editOperation" data-id="${operation.ids
      }" onclick="operationsEdit(${operation.ids
      })"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btnDeleted text-red-500" data-id="${operation.ids
      }"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
                </table>
            `;
  });

  const btnDeleted = $$(".btnDeleted");
  for (const btn of btnDeleted) {
    const operationId = btn.getAttribute("data-id");
    btn.addEventListener("click", () => {
      $("#operationsAndnewOperation").classList.add("hidden")
      $("#tablesAndForms").classList.add("hidden")
      $("#alertDeleteOp").classList.remove("hidden")
      $("#submit-deleteOp").setAttribute("data-id", operationId);
    });
  }
};


$("#submit-deleteOp").addEventListener("click", () => {
  $("#operationsAndnewOperation").classList.remove("hidden")
  $("#tablesAndForms").classList.remove("hidden")
  $("#alertDeleteOp").classList.add("hidden")
  const operationId = $("#submit-deleteOp").getAttribute("data-id")
  deleteOperation(operationId)
})

$("#submit-deleteOp").addEventListener("click", () => {
  $("#operationsAndnewOperation").classList.remove("hidden")
  $("#tablesAndForms").classList.remove("hidden")
  $("#alertDeleteOp").classList.add("hidden")
  const operationId = $("#submit-deleteOp").getAttribute("data-id")
  deleteOperation(operationId)
})

generateOperationTable(JSON.parse(localStorage.getItem("operations")));

const operationInfo = () => {
  const ids = parseInt(generateID());
  const descriptionOperation = $("#description").value;
  const amountOperation = parseInt($("#amountOperation").value);
  const operationType = $("#operationType").value;
  const selectCategoryOperation = $("#selectCategoryOperation").value;
  const dateOperation = $("#dateOperation").value;
  return {
    descriptionOperation,
    amountOperation,
    operationType,
    selectCategoryOperation,
    dateOperation,
    ids,
  };
};

// *******************************NEW OPERATION*********************************

const generateNewOperation = () => {
  if ($("#description").value === "") {
    return alert("Debe ingresar un nombre para la operación");
  } else {
    $("#tableContainer").innerHTML = "";
    operations.push(operationInfo());
    $("#description").value = "";
    localStorage.setItem("operations", JSON.stringify(operations));
    generateOperationTable(JSON.parse(localStorage.getItem("operations")));
  };
}

$("#btnAddOperation").addEventListener("click", generateNewOperation);

$("#descriptionEdit").addEventListener("keypress", (e) => {
  if (e.keyCode == "13") {
    generateNewOperation();
  }
});

// ***************************************DELETE OPERATION**********************************************

const deleteOperation = (operationId) => {
  $("#tableContainer").innerHTML = "";
  let operationsLocal = JSON.parse(localStorage.getItem("operations"));
  let newOperations = operationsLocal.filter((operation) => {
    return operation.ids !== parseInt(operationId);
  });
  operations = newOperations;
  localStorage.setItem("operations", JSON.stringify(operations));
  generateOperationTable(JSON.parse(localStorage.getItem("operations")));
};

const findOperation = (ids) => {
  return operations.find((operations) => operations.ids === ids);
};

// **************************************EDIT & CANCEL*************************************************
const operationsEdit = (ids) => {
  $("#btnEditOperation").setAttribute("data-id", ids);
  $("#editOperationContainer").classList.remove("hidden");
  $("#balance").classList.add("hidden");
  $("#select-box-filtros").classList.add("hidden");
  $("#container-categories").classList.add("hidden");
  $("#operationContainer").classList.add("hidden");
  const chosenOp = findOperation(ids);
  $("#descriptionEdit").value = chosenOp.descriptionOperation;
  $("#amountOperationEdit").value = chosenOp.amountOperation;
  $("#operationTypeEdit").value = chosenOp.operationType;
  $("#selectCategoryOperationEdit").value = chosenOp.selectCategoryOperation
  $("#dateOperationEdit").value = chosenOp.dateOperation;
};

const saveOperationData = (ids) => {
  return {
    descriptionOperation: $("#descriptionEdit").value,
    amountOperation: $("#amountOperationEdit").value,
    selectCategoryOperation: $("#selectCategoryOperationEdit").value,
    operationType: $("#operationTypeEdit").value,
    dateOperation: $("#dateOperationEdit").value,
    ids,
  };
};

const editOperations = (ids) => {
  return operations.map((operation) => {
    if (operation.ids === parseInt(ids)) {
      return saveOperationData(parseInt(ids));
    }
    return operation;
  });
};


//ADD CATEGORY SELECT

const categoriesInSelect = () => {
  const categories = getDataFromLocalStorage("categories");

  $("#filter-categories").innerHTML = `<option value="Todas">Todas</option>`;
  $("#selectCategoryOperationEdit").innerHTML = ''

  for (const { id, nombre } of categories) {
    $("#filter-categories").innerHTML += `<option  id='${id}' class="flex flex col">${nombre}</option>`;
    $("#selectCategoryOperation").innerHTML += `<option  id='${id}' class="flex flex col">${nombre}</option>`;
    $("#selectCategoryOperationEdit").innerHTML += `<option  id='${id}' class="flex flex col">${nombre}</option>`;
  }
};

window.addEventListener("load", () => {
  setDay()
  categoriesInSelect($("#filter-categories"))
})




// ****FILTERS****
const filterOperationsType = (array, type) => {
  const operations = array.filter((curr) => {
    return curr.type === type;
  });
  return operations;
};

const applyFilters = () => {
  const type = $("#type-filter").value;
  const filterForType = getDataFromLocalStorage("operations").filter(
    (operation) => {
      if (type === "todos") {
        return operation;
      }
      return operation.operationType === type;
    }
  );
  const category = $("#filter-categories").value;
  const finalFilter = filterForType.filter((operation) => {
    if (category === "Todas") {
      return operation;
    }
    return operation.selectCategoryOperation === category;
  });
  return finalFilter;
};

//FILTER FOR TYPE
$("#type-filter").onchange = () => {
  const arrayFilterType = applyFilters();
  generateOperationTable(arrayFilterType);
};

//FILTER FOR CATEGORY
$("#filter-categories").onchange = () => {
  const arrayFilterFinal = applyFilters();
  generateOperationTable(arrayFilterFinal);
};

//FILTER FOR DATE
const orderDates = (arr) => {
  const orderedDates = arr.sort((a, b) => {
    return new Date(b.dateOperation) - new Date(a.dateOperation);
  });

  const finalDate = orderedDates.map((operation) => {
    new Date(operation.dateOperation).toLocaleDateString();
    return operation;
  });
  return finalDate;
};

const newDates = (operations) => {
  const selectedDates = [];
  for (let i = 0; i < operations.length; i++) {
    if (
      new Date($("#date-filter").value) <= new Date(operations[i].dateOperation)
    ) {
      selectedDates.push(operations[i]);
    }
  }
  return selectedDates;
};

setDay = () => {
  const inputDate = $("#date-filter")
  let newDate = new Date()
  let month =  newDate.getMonth() + 1
  let day = 1;
  let year = newDate.getFullYear();
  if(day<10){day='0'+day}
  if(month<10){month='0'+month}
  inputDate.value= year + "-" + month + "-" + day
}; 

$("#date-filter").onchange = () => {
  const filterDates = newDates(getDataFromLocalStorage("operations"));
  generateOperationTable(orderDates(filterDates));
};

// FILTER BY ORDER
let selectSort = $("#order-filter");
selectSort.onchange = () => {
  const sortedArray = sortBy();
  generateOperationTable(sortedArray);
};

const sortBy = () => {
  let sort = selectSort.value;
  let operations = applyFilters();
  if (sort === "a-z") {
    operations = operations.sort((a, b) => {
      return a.descriptionOperation.localeCompare(b.descriptionOperation);
    });
  } else if (sort === "z-a") {
    operations = operations.sort((a, b) => {
      return b.descriptionOperation.localeCompare(a.descriptionOperation);
    });
  } else if (sort === "mayor-monto") {
    operations = operations.sort((a, b) => {
      return b.amountOperation - a.amountOperation;
    });
  } else if (sort === "menor-monto") {
    operations = operations.sort((a, b) => {
      return a.amountOperation - b.amountOperation;
    });
  } else if (sort === "mas-recientes") {
    operations = operations.sort((a, b) => {
      return new Date(b.dateOperation) - new Date(a.dateOperation);
    });
  } else if (sort === "menos-recientes") {
    operations = operations.sort((a, b) => {
      return new Date(a.dateOperation) - new Date(b.dateOperation);
    });
  }
  return operations;
};


// ***BALANCE***
const gainBalance = $("#gananciasBalance");
const spendingBalance = $("#gastosBalance");
let balanceTotal = "#balance-total";

const generateTableBalance = () => {
  getDataFromLocalStorage("operations");
  let gainBalance = 0;
  let spendingBalance = 0;

  for (const operation of operations) {
    if (operation.operationType === "spending") {
      spendingBalance += parseInt(operation.amountOperation);
    } else if (operation.operationType === "gain") {
      gainBalance += parseInt(operation.amountOperation);
    }
  }
  balanceTotal = gainBalance - spendingBalance;
  $("#balance").innerHTML = `
  <h2 class="font-bold text-center text-[#79b9b9] p-2 mt-4 text-[20px]">Balance</h2>
  <div class="grid gap-4 grid-cols-2 m-3 flex">
      <div>
          <h3 class="flex mb-5 mt-3 text-[18px]">Ganancias</h3>
      </div>
      <div>
          <h3 id="gananciasBalance" class="font-bold text-green-700 ml-4 mt-3 text-[18px]">+${gainBalance}</h3>
      </div>
      <div>
          <h3 id="gastosBalance" class="flex mb-5 text-[18px]">Gastos</h3>
      </div>
      <div class="font-bold text-red-700 ml-4 text-[18px]">
          <p>-${spendingBalance}</p>
      </div>
      <div>
          <h1 class="font-bold text-[20px]">Total</h1>
      </div> 
      <div id="balance-total" class="font-bold text-[18px] ml-4">$${balanceTotal}</div> 
        `;
};
generateTableBalance();

// *****REPORTS******

// SEPARATE BY TYPE OF OPERATION
const operationsGain = [];
const operationSpending = [];
const operations2 = getDataFromLocalStorage("operations");

for (const operation of operations2) {
  if (operation.operationType === "spending") {
    operationSpending.push(operation);
  } else {
    operationsGain.push(operation);
  }
}

// higher gain

const arrayOpGain = Math.max(...operationsGain.map((operation) => parseInt(operation.amountOperation)));
const arrayOpGain2 = operationsGain.filter(
  (operationsGain) => parseInt(operationsGain.amountOperation) === arrayOpGain
);

// higher spending
const arrayOpSpending = Math.max(
  ...operationSpending.map((operation) => parseInt(operation.amountOperation))
);
const arrayOpSpending2 = operationSpending.filter(
  (operationSpending) => parseInt(operationSpending.amountOperation) === arrayOpSpending
);

// category more spending

let nameOpSpending = ''
let amountOpSpending = ''
for (const operation of arrayOpSpending2) {
  nameOpSpending = operation.selectCategoryOperation;
  amountOpSpending = operation.amountOperation
}
// category more gain

let nameOpGain = ''
let amountOpGain = ''
for (const operation of arrayOpGain2) {
  nameOpGain = operation.selectCategoryOperation;
  amountOpGain = parseInt(operation.amountOperation)
}

// month more gain

let monthGain = ''
let monthGainAmount = ''
for (const operation of arrayOpGain2) {
  monthGainAmount = operation.amountOperation
  if (formatDate(operation.dateOperation).slice(3,5) === "01") {
    monthGain = "Enero";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "02") {
    monthGain =  "Febrero";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "03") {
    monthGain = "Marzo";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "04") {
    monthGain =  "Abril";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "05") {
    monthGain =  "Mayo";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "06") {
    monthGain =  "Junio";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "07") {
    monthGain =  "Julio";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "08")  {
    monthGain = "Agosto";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "09") {
    monthGain =  "Septiembre";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "10") {
    monthGain = "Octubre";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "11")  {
    monthGain = "Noviembre";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "12") {
    monthGain = "Diciembre";
  }
}

// month more spending

let monthSpending = ''
let monthSpendingAmount = ''
for (const operation of arrayOpSpending2) {
  monthSpendingAmount = operation.amountOperation
  if (formatDate(operation.dateOperation).slice(3,5) === "01") {
    monthSpending = "Enero";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "02") {
    monthSpending =  "Febrero";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "03") {
    monthSpending = "Marzo";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "04") {
    monthSpending =  "Abril";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "05") {
    monthSpending =  "Mayo";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "06") {
    monthSpending =  "Junio";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "07") {
    monthSpending =  "Julio";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "08")  {
    monthSpending = "Agosto";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "09") {
    monthSpending =  "Septiembre";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "10") {
    monthSpending = "Octubre";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "11")  {
    monthSpending = "Noviembre";
  } else if (formatDate(operation.dateOperation).slice(3,5) === "12") {
    monthSpending = "Diciembre";
  }
}

// separate by category
let categoriesSpending = 0;
let categoriesGain = 0;

const filterSpendingAndGain = Object.values(
  operations2.reduce((acc, operation) => {
    acc[operation.selectCategoryOperation] = acc[
      operation.selectCategoryOperation
    ] || {
      category: operation.selectCategoryOperation,
      spending: 0,
      gain: 0,
      balance: 0,
      date: formatDate(operation.dateOperation),
    };
    if (operation.operationType === "spending") {
      acc[operation.selectCategoryOperation].spending +=
      parseInt(operation.amountOperation);
    } else {
      acc[operation.selectCategoryOperation].gain += parseInt(operation.amountOperation);
    }
    acc[operation.selectCategoryOperation].balance =
      acc[operation.selectCategoryOperation].gain -
      acc[operation.selectCategoryOperation].spending;
    return acc;
  }, {})
);

// total for categories
//name
let nameOfFilterCategories = "";
for (const operation of filterSpendingAndGain) {
  nameOfFilterCategories = operation.category;
}

//gain
let GainOfFilterCategories = "";
for (const operation of filterSpendingAndGain) {
  GainOfFilterCategories = operation.gain;
}

// spend
let SpendOfFilterCategories = "";
for (const operation of filterSpendingAndGain) {
  SpendOfFilterCategories = operation.spending;
}

//more balance
const moreBalance = [];
const moreBalanceCategory = [];
for (const operation of filterSpendingAndGain) {
  moreBalance.push(operation.balance);
}
moreBalanceCategory.push(
  filterSpendingAndGain.sort((a, b) => b.balance - a.balance)
);

const moreBalanceCategoryName = [];
for (const operations of moreBalanceCategory) {
  for (const operation of operations) {
    moreBalanceCategoryName.push(operation.category);
  }
}

// total months

for (const item of operations2) {

    item.dateOperation = (formatDate(item.dateOperation).slice(3,10))
}

const filterSpendingAndGainMonth = Object.values(
  operations2.reduce((acc, operation) => {
    acc[operation.dateOperation] = acc[operation.dateOperation] || {
      spending: 0,
      gain: 0,
      balance: 0,
      date: operation.dateOperation,
    };
    if (operation.operationType === "gain") {
      acc[operation.dateOperation].gain += parseInt(operation.amountOperation);
    } else {
      acc[operation.dateOperation].spending += parseInt(operation.amountOperation);
    }
    acc[operation.dateOperation].balance =
      acc[operation.dateOperation].gain - acc[operation.dateOperation].spending;
    return acc;
  }, {})
);

const generateReportsTable = () => {
  $("#reportsTable").innerHTML += `
    <h3 class="mt-4 text-xl text-[#79b9b9] font-bold">Resumen</h3>
      <table class="w-full">
              <tr class= "font-bold">
                  <td class="text-[8px] md:text-[12px] lg:text-[20px]">Categoria con mayor ganancia</td>
                  <td class="text-[8px] md:text-[12px] lg:text-[20px]">${nameOpGain}</td>
                  <td class="text-[8px] md:text-[12px] lg:text-[20px] text-green-600">+$${amountOpGain
    }</td>
              </tr>
            
            <tr class="font-bold">
              <td class="text-[8px] md:text-[12px] lg:text-[20px]">Categoria con mayor gasto</td>
              <td class="text-[8px] md:text-[12px] lg:text-[20px]">${nameOpSpending}</td>
              <td class="text-[8px] md:text-[12px] lg:text-[20px] text-red-600">-$${amountOpSpending
    }</td>
            </tr>
            <tr class="font-bold">
              <td class="text-[8px] md:text-[12px] lg:text-[20px]">Categoria con mayor balance</td>
              <td class="text-[8px] md:text-[12px] lg:text-[20px]">${moreBalanceCategoryName.slice(0, 1)}</td>
              <td class= "text-[8px] md:text-[12px] lg:text-[20px] ${moreBalance.balance > 0 ? "text-red-600" : "text-green-600"
    }">$${Math.max(...moreBalance)}</td>
            </tr>
            <tr class="font-bold">
              <td class="text-[8px] md:text-[12px] lg:text-[20px]">Mes con mayor ganancia</td>
              <td class="text-[8px] md:text-[12px] lg:text-[20px]">${monthGain}</td>
              <td class="text-[8px] md:text-[12px] lg:text-[20px] text-green-600">+$${monthGainAmount
    }</td>
            </tr>
            <tr class="font-bold">
              <td class="text-[8px] md:text-[12px] lg:text-[20px]">Mes con mayor gasto</td>
              <td class="text-[8px] md:text-[12px] lg:text-[20px]">${monthSpending}</td>
              <td class="text-[8px] md:text-[12px] lg:text-[20px] text-red-600">-$${monthSpendingAmount
    }</td>
            </tr>           
        </table>
  `;
  for (const item of filterSpendingAndGain) {
    $("#totalCategoriesReports").innerHTML += `
                    <tr class="font-bold">
                      <td class="text-center mb-10 text-[8px] md:text-[12px] lg:text-[20px]">${item.category}</td>
                      <td class="text-green-600 text-center ml-10 text-[8px] md:text-[12px] lg:text-[20px]">+${item.gain
      }</td>
                      <td class="text-red-600 text-center text-[8px] md:text-[12px] lg:text-[20px]">-$${item.spending
      }</td>
                      <td class="text-center mr-10 text-[8px] md:text-[12px] lg:text-[20px] ${item.balance > 0 ? "text-green-600" : "text-red-600"
      }">$${item.balance}</td>
                    </tr>`;
  }

  for (const { date, balance, spending, gain } of filterSpendingAndGainMonth) {
    $("#totalMonths").innerHTML += `
                    <tr class="font-bold space-y-4">
                        <td class="text-center ml-10 mb-10 text-[8px] md:text-[12px] lg:text-[20px]">${formatDate(date)}</td>
                        <td class="text-green-600 text-center ml-10 text-[8px] md:text-[12px] lg:text-[20px]">+${gain}</td>
                        <td class="text-red-600 text-center text-[8px] md:text-[12px] lg:text-[20px]">-$${spending}</td>
                        <td class="text-center mr-10 text-[8px] md:text-[12px] lg:text-[20px] ${balance > 0 ? "text-green-600" : "text-red-600"
      }">$${balance}</td>
   
                        </tr>`;
  }
};

// ********* DOM FUNCTIONS **********
const toggleFilter = $("#toggleFilters");
const containerFilter = $("#filterContainer");
const btnAddOperation = $("#btnAddOperation");
const toggleOperation = $("#toggleOperation");
const toggleOperation2 = $("#toggleOperation2");
const sectionsWithoutOperations = () => {
  $("#balance").classList.add("hidden");
  $("#select-box-filtros").classList.add("hidden");
  $("#container-categories").classList.add("hidden");
  $("#operationContainer").classList.add("hidden");
}

//FILTER EVENT
toggleFilter.addEventListener("click", (e) => {
  e.preventDefault();
  if (toggleFilter.innerText === "Ocultar filtros") {
    containerFilter.classList.add("hidden");
    toggleFilter.innerText = "Mostrar filtros";
  } else {
    containerFilter.classList.remove("hidden");
    toggleFilter.innerText = "Ocultar filtros";
  }
});

// OPERATION EVENTS
btnAddOperation.addEventListener("click", (e) => {
  e.preventDefault();
  $("#newOperationContainer").classList.add("hidden");
  $("#balance").classList.remove("hidden");
  $("#select-box-filtros").classList.remove("hidden");
  $("#operationContainer").classList.remove("hidden");
});

btnAddOperation.addEventListener("click", () => {
  generateTableBalance();
});

toggleOperation.addEventListener("click", (e) => {
  e.preventDefault();
  $("#newOperationContainer").classList.remove("hidden");
  $("#operationContainer").classList.add("hidden");
  sectionsWithoutOperations()
});

$("#btnEditOperation").addEventListener("click", () => {
  const operationsId = $("#btnEditOperation").getAttribute("data-id");
  $("#editOperationContainer").classList.add("hidden");
  $("#tableContainer").innerHTML = "";
  let operationsEdit = editOperations(parseInt(operationsId));
  localStorage.setItem("operations", JSON.stringify(operationsEdit));
  operations = operationsEdit;
  generateOperationTable(JSON.parse(localStorage.getItem("operations")));
});

$("#cancelEditOp").addEventListener("click", () => {
  $("#editOperationContainer").classList.add("hidden");
  $("#balance").classList.remove("hidden");
  $("#select-box-filtros").classList.remove("hidden");
  $("#operationContainer").classList.remove("hidden");
});

$("#cancelAddOperation").addEventListener("click", () => {
  $("#newOperationContainer").classList.add("hidden");
  $("#balance").classList.remove("hidden");
  $("#select-box-filtros").classList.remove("hidden");
  $("#operationContainer").classList.remove("hidden");
});

//CATEGORIES EVENTS
$("#showCategories").addEventListener("click", (e) => {
  e.preventDefault();
  $("#container-categories").classList.remove("hidden");
  $(".balance-section").classList.add("hidden");
  $("#select-box-filtros").classList.add("hidden");
  $("#operationContainer").classList.add("hidden");
  $("#newOperationContainer").classList.add("hidden");
  $("#editOperationContainer").classList.add("hidden");
  $("#reportsTableContainer").classList.add("hidden");
});

$("#btn-cancel").addEventListener("click", () => {
  $("#container-edit-categories").classList.add("hidden");
  $("#container-categories").classList.remove("hidden");
});

// REPORTS EVENTS
$("#showReports").addEventListener("click", (e) => {
  e.preventDefault();
  $("#reportsTableContainer").classList.remove("hidden");
  $("#container-categories").classList.add("hidden");
  $(".balance-section").classList.add("hidden");
  $("#select-box-filtros").classList.add("hidden");
  $("#operationContainer").classList.add("hidden");
  $("#newOperationContainer").classList.add("hidden");
  $("#editOperationContainer").classList.add("hidden");
  $("#operations").classList.add("hidden");
  $("#reportsTable").classList.remove("hidden");
});



if (operations.length > 3) {
  $("#ImgReports").classList.add("hidden");
  $("#reportsTable").classList.remove("hidden");
  $("#totalMonths").classList.remove("hidden");
  $("#totalCategoriesReports").classList.remove("hidden");
  generateReportsTable();
}


if (operations.length > 0) {
  $("#imgOperations").classList.add("hidden");
  $(".tableHeader").classList.remove("hidden")
}