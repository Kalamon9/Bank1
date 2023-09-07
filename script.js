'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const htmlRow = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}€</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', htmlRow);
  });
};
// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummery = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;
  labelSumOut.textContent = `${Math.abs(outcome)}€`;
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummery(account1.movements);

// const user = 'Karolina Anna Monnier';
// const username = user
//   .toLowerCase()
//   .split(' ')
//   .map(name => name[0])
//   .join('');

// console.log(username);

// const createUsername = function (user) {
//   const username = user
//     .toLowerCase()
//     .split(' ')
//     .map(name => name[0])
//     .join('');
//   return username;
// };

// console.log(createUsername('Karolina Anna Anna Monnier'));
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  //Display balance
  calcDisplayBalance(acc);
  //Display movements
  displayMovements(acc.movements);
  //Display summary
  calcDisplaySummery(acc);
};

let curAcc;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('log');
  curAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(curAcc);
  if (curAcc?.pin === Number(inputLoginPin.value)) {
    // console.log('login');
    //Display UI and message
    labelWelcome.textContent = `Welcome ${curAcc.owner.split(' ')[0]}!`;
    containerApp.style.opacity = 100;
    //Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(curAcc);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  // console.log(amount, reciverAcc);
  if (
    amount > 0 &&
    reciverAcc &&
    curAcc.balance >= amount &&
    curAcc.username !== reciverAcc?.username
  ) {
    // console.log('valid');
    curAcc.movements.push(-amount);
    reciverAcc.movements.push(amount);
    updateUI(curAcc);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && curAcc.movements.some(mov => mov >= amount * 0.1)) {
    curAcc.movements.push(amount);
    updateUI(curAcc);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername?.value === curAcc.username &&
    Number(inputClosePin?.value) === curAcc.pin
  ) {
    const index = accounts.findIndex(acc => acc.username === curAcc.username);
    // console.log(index);
    //deletes account
    accounts.splice(index, 1);
    //hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(curAcc.movements, sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;
// const movementsUsa = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
const movementsUsa = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUsa);

const movementsDesc = movements.map(
  (mov, i, arr) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
// console.log(movementsDesc);

const deposites = movements.filter(function (mov) {
  return mov > 0;
});
const withdrawals = movements.filter(mov => mov < 0);
// console.log(deposites, withdrawals);

const balance = movements.reduce(function (accumulator, currentValue, i, arr) {
  // console.log(`iteration ${i}: ${accumulator}`);
  return accumulator + currentValue;
}, 0);
// console.log(balance);

// pipeline - you can chain when method returns arrey - reduce returns a value
// to debug you can console log in next chain method to see the returned arrey
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  // .map(mov => mov * eurToUsd)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUsd;
  })
  // .reduce((acc, mov) => acc + mov, 0);
  .reduce((acc, mov, i, arr) => {
    // console.log(arr);
    return acc + mov;
  }, 0);
// console.log(totalDepositsUSD);

//find will return the first value for which the condition is true , not new arrey!
const firstWithdrewal = movements.find(mov => mov < 0);
// console.log(firstWithdrewal);
const accJessica = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(accJessica);

// console.log(movements.includes(-130));
movements.some(mov => mov === -130);
//returns booliean -specify condition
const isDeposit = movements.some(mov => mov > 0);
// console.log(isDeposit);

//return true if all are true
const isEveryDeposit = movements.every(mov => mov > 0);

const movDeposits = mov => mov > 0;
// console.log(account4.movements.every(movDeposits));

// flat and flatMap
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// flatMap
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance2);

// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// Numbers
// console.log(movements);

// a = current number b = next number
// return < 0, A, B (keep order)
// return > 0, B, A (switch order)

// Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
movements.sort((a, b) => a - b);
// console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
// console.log(movements);

// Emprty arrays + fill method
const x = new Array(7);
// console.log(x);
// console.log(x.map(() => 5));
x.fill(1, 3, 5);
x.fill(1);
// console.log(x);

arr.fill(23, 2, 6);
// console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});
