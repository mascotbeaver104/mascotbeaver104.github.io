var disp= '0';
let inputArr = [];
let accIn = true;
let opIndex = -1;
decimal = false;

let operators = {
    '+': function(a, b){return Number(a)+Number(b)},
    '-': function(a,b){return Number(a)-Number(b)},
    '/': function(a,b){return Number(a)/Number(b)},
    '*': function(a,b){return Number(a)*Number(b)}
}

function calculator(input){
    if(/[0-9]/.test(input)){
        if((inputArr.length == 1 && inputArr[0] == 0)||(inputArr.length-1 == opIndex+1 && inputArr[inputArr.length-1] == 0)){
          inputArr.pop();
        }
        if(accIn === false){
            disp = '0';
            inputArr = [];
            accIn = true;
            opIndex = -1;
            decimal=false;
        }
        inputArr.push(input);
        disp = inputArr.join('');
    }
    if(/\./.test(input) && accIn && decimal ===false){
        inputArr.push(input);
        disp = inputArr.join('');
        decimal = true;
    }
    if(/\+|\-|\*|\//.test(input)){
      if(opIndex === inputArr.length-1){
        inputArr.pop();
        opIndex = -1;
      }
        if(opIndex === -1 && inputArr.length > 0){
        opIndex = inputArr.length;
        inputArr.push(input);
        disp=inputArr.join('');
        accIn = true;
        decimal =false;
        } 
        else if(opIndex > -1 && inputArr.length-1 != opIndex){
            disp = operators[inputArr[opIndex]](Number(inputArr.slice(0,opIndex).join('')), Number(inputArr.slice(opIndex+1).join('')));
            inputArr = String(disp).split('');
            opIndex = inputArr.length;
            inputArr.push(input);
            disp=inputArr.join('');
            decimal = false;
        }
    }
    if(/enter/.test(input)){
        if(opIndex != 0 && inputArr.length-1 > opIndex){
            accIn = false;
            disp = Math.round(operators[inputArr[opIndex]](Number(inputArr.slice(0,opIndex).join('')), Number(inputArr.slice(opIndex+1).join('')))*100000)/100000;
            inputArr = String(disp).split('');
            opIndex = -1;
        }
    }
    if(/clear/.test(input)){
        if(opIndex !=-1){
            decimal=false;
        while(inputArr.slice(opIndex+1).length>0){
            inputArr.pop();
            disp=inputArr.join('');
        }
    }else{
        input = 'allClear';
    }
}
    
    if(/allClear/.test(input)){
        disp = '0';
        inputArr = [];
        accIn = true;
        opIndex = -1;
        decimal=false;
    }

    const output = document.getElementById('display');
    const maxScrollLeft = output.scrollWidth;
    output.innerHTML = disp;
    output.scrollLeft = maxScrollLeft;
}

document.getElementById('one').addEventListener('click', function(){calculator(1)});
document.getElementById('two').addEventListener('click', function(){calculator(2)});
document.getElementById('three').addEventListener('click', function(){calculator(3)});
document.getElementById('four').addEventListener('click', function(){calculator(4)});
document.getElementById('five').addEventListener('click', function(){calculator(5)});
document.getElementById('six').addEventListener('click', function(){calculator(6)});
document.getElementById('seven').addEventListener('click', function(){calculator(7)});
document.getElementById('eight').addEventListener('click', function(){calculator(8)});
document.getElementById('nine').addEventListener('click', function(){calculator(9)});
document.getElementById('zero').addEventListener('click', function(){calculator(0)});
document.getElementById('add').addEventListener('click', function(){calculator('+')});
document.getElementById('multiply').addEventListener('click', function(){calculator('*')});
document.getElementById('divide').addEventListener('click', function(){calculator('/')});
document.getElementById('subtract').addEventListener('click', function(){calculator('-')});
document.getElementById('equals').addEventListener('click', function(){calculator('enter')});
document.getElementById('decimal').addEventListener('click', function(){calculator('.')});
document.getElementById('c').addEventListener('click', function(){calculator('clear')});
document.getElementById('clear').addEventListener('click', function(){calculator('allClear')});
document.getElementById('display').innerHTML = disp;