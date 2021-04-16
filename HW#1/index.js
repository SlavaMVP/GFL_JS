//? /////////////////////////////////////////////////? вариант #1 банальный
class MyCalcuator {
  _x;
  _y;
  constructor(a = 0, b = 0) {
    this._x = a;
    this._y = b;
  }
  add() {
    return this._x + this._y;
  }
  subtract() {
    return this._x - this._y;
  }
  divide() {
    if (this._x === 0 || this._y === 0) return 0;
    return this._x / this._y;
  }
  multiply() {
    return this._x * this._y;
  }
  percent() {
    if (this._x === 0 || this._y === 0) return "нельзя рассчитать";
    if (this._x === this._y) return "цифры равны";
    let result = 0;
    this._x < this._y
      ? (result = `Меньше на:${100 - Math.round((this._x / this._y) * 100)}%`)
      : (result = `Больше на:${100 - Math.round((this._y / this._x) * 100)}%`);
    return result;
  }
}
let obj = new MyCalcuator(3, 3); //если ничего не зададим то 0
console.log(obj.percent());
//? ///////////////////////////////////////////////////////////////////    вариант #2 c bind
//для нового расчета создаем обект
class NumObj {
  constructor(a = 0, b = 0) {
    this._x = a;
    this._y = b;
  }
}
//! класс только с методами (может быть библтотека)
class MyCalcuator2 {
  static add() {
    return this._x + this._y;
  }
  static subtract() {
    return this._x - this._y;
  }
  static divide() {
    if (this._x === 0 || this._y === 0) return 0;
    return this._x / this._y;
  }
  static multiply() {
    return this._x * this._y;
  }
  static percent() {
    if (this._x === 0 || this._y === 0) return "нельзя рассчитать";
    if (this._x === this._y) return "цифры равны";
    let result = 0;
    this._x < this._y
      ? (result = `Меньше на:${100 - Math.round((this._x / this._y) * 100)}%`)
      : (result = `Больше на:${100 - Math.round((this._y / this._x) * 100)}%`);
    return result;
  }
}
let newNumObj = new NumObj(4, 8);
//этот способ хорош тем что все методы в одном классе (и не идут в прототипы обьекта)
console.log(MyCalcuator2.add.apply(newNumObj));
//можно поизвращатся еще так;)
newNumObj.add = MyCalcuator2.subtract.bind(newNumObj); //копировать метод в свой обьект (!эксперемента ради)
console.log(newNumObj.add()); //и юзать как свой
//////////////////////////////////////////////////////////////////////////////////////////////////////////////вариант 2.5 extend
//! класс только с методами (может быть библтотека)
class MyCalcuator3 {
  add() {
    return this._x + this._y;
  }

  subtract() {
    return this._x - this._y;
  }

  divide() {
    if (this._x === 0 || this._y === 0) return 0;
    return this._x / this._y;
  }

  multiply() {
    return this._x * this._y;
  }

  percent() {
    if (this._x === 0 || this._y === 0) return "нельзя рассчитать";
    if (this._x === this._y) return "цифры равны";
    let result = 0;
    this._x < this._y
      ? (result = `Меньше на:${100 - Math.round((this._x / this._y) * 100)}%`)
      : (result = `Больше на:${100 - Math.round((this._y / this._x) * 100)}%`);
    return result;
  }
}

class NumObj2 extends MyCalcuator3 {
  constructor(a = 0, b = 0) {
    super();
    this._x = a;
    this._y = b;
  }
}
let newOp = new NumObj2(4, 5);
console.log(newOp.add());
//? /////////////////////////////////////////////////////////////////////// вариант #3  с приминением функций конструкторов
function MathObj(a, b) {
  this._x = a;
  this._y = b;
  this.showArguments = function () {
    return `x = ${this._x}; y = ${this._y};`;
  };
}
//добавляем в прототип наши методы
MathObj.prototype.add = function () {
  return `${this._x + this._y}`;
};
let calculation2 = new MathObj(3, 3);
console.log(calculation2.showArguments());
console.log(calculation2.add());
