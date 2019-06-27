'use strict'

let rollCount = 0;

class diceArea{
    constructor(id,opposite){
    this.opposite = opposite;
    this.arr= [];
    this.elem=document.getElementById(id);
    }
    disp(){
        this.elem.innerHTML = '';
        for(let i=0; i<this.arr.length; i++){
            this.arr[i].disp(this.elem);
        }
    }
    select(i){
        this.opposite.arr.push(...this.arr.splice(i, 1));
        this.opposite.disp();
        this.disp();
    }
    selectAll(){
        let len=this.arr.length;
        for(let i=0; i<len; i++){
            this.select(0);
        }
    }
    addSelectors(){
        let area=this;
        for(let i=0; i<this.arr.length; i++){
             let pic = document.getElementById(String(area.arr[i].id));
             pic.onclick = function(){
                 area.select(i);
                 area.addSelectors();
                 area.opposite.addSelectors();
             }
         }
     }
};

class Dice{
    constructor(id){
        this.id = id;
        this.value = 6;
        this.img = './img/'+this.value+this.isReverse()+'.svg';
    }
    roll(){
        this.value = Math.round(Math.random()*5)+1;
        this.img = './img/'+this.value+this.isReverse()+'.svg';
    }
    isReverse(){
        if(Math.round(Math.random()) > 0 && (this.value===2||this.value===3||this.value===6)){
            return 'reverse';
        }else{
            return '';
        }
    }
    disp(elem){
        let pic = document.createElement('img')
        elem.appendChild(pic);
        pic.setAttribute('src', this.img);
        pic.className = 'dice';
        pic.style.zIndex = 6;
        pic.id = String(this.id);
    }
}

class scoreSpace{
    constructor(name, op){
        this.name = name;
        this.score = -1;
        this.elem = document.getElementById(name);
        this.clicked = false;
        if(op === true){
            let relnam = this.name.split('');
            relnam[0] = relnam[0].toUpperCase();
            relnam = 'op' + relnam.join('');
            this.elem = document.getElementById(relnam);
        } else{
            this.addListener(this);
        }
        this.click = function(space){
        if(rollCount >= 0 && space.score === -1 && space.clicked === false){
            space.score = getScore(space);
            space.elem.innerHTML = space.score;
            rollCount = -1;
            checkForWin();
            space.clicked = true;
                }
            }
        this.clickHandler = this.click.bind(this);
    }

    dispScore(){
        this.elem.innerHTML = score;
    }


    addListener(space){
        this.elem.addEventListener('click', this.clickHandler);
    }
}

let scoreSpaceElems = [
    'ones','twos','threes','fours',
    'fives','sixes','threeOfAKind',
    'fourOfAKind','fullHouse','smStraight',
    'lgStraight','yahtzee','chance'
];

class scoreList{
    constructor(elems, op){
        this.isOp ='';
        if(op){
            this.isOp = 'op';
        }
        this.arr = [];
        for(let i=0; i<elems.length; i++){
            this.arr.push(new scoreSpace(elems[i], op));
        }
        this.yahtzees = 0;
        this.extraYahtz = 0;
        this.upperBonus = document.getElementById(this.isOp + 'upperBonus');
        this.upperTotal = document.getElementById(this.isOp + 'upperTotal');
        this.lowerTotal = document.getElementById(this.isOp + 'lowerTotal');
        this.grandTotal = document.getElementById(this.isOp + 'grandTotal');
        this.yahtzeeBonus = document.getElementById(this.isOp, 'yahtzeeBonus');
    }

    getYahtzeeBonus(){
        if(yahtzees > 1){
        this.extraYahtz = (yahtzees-1)*100;
        this.yahtzeeBonus.innerHTML = extraYahtz;
        } else{
            return;
        }
    }

    dispTotals(){
        let scores = this.getScores();
        let upperScore = scores.slice(0,6).reduce((a,b)=>a+b);
        let lowerScore = scores.slice(6).reduce((a,b)=>a+b) + extraYahtz;
        if(upperScore < 35){
            this.upperBonus.innerHTML = 0;
        } else{
            this.upperBonus.innerHTML = 35;
            upperScore +=35;
        }
        this.upperTotal.innerHTML = upperScore;
        this.lowerTotal.innerHTML = lowerScore;
        this.grandTotal.innerHTML = lowerScore + upperScore;
    }
    getScores(){
        let out=[];
        for(let i=0; i<this.arr.length; i++){
            out.push(this.arr[i].score);
        }
        return out;
    }
    
}

let playerScore = new scoreList(scoreSpaceElems, false);
let opScore = new scoreList(scoreSpaceElems, true);
let rollbtn = document.getElementById('roll');
rollbtn.addEventListener('click', rollDice);
rollbtn.style.opacity = 1;
let diceIn = new diceArea('diceIn', undefined);
let diceOut = new diceArea('diceOut', diceIn);
diceIn.opposite = diceOut;



/* getScore takes a scoreSpace we want to add
    a score to, and an array of dice to get the
    score from ('all' to use all). It returns
    the calculated score from the dice given the
    target. */
function getScore(target, allDice = [...diceIn.arr, ...diceOut.arr]){
    let outArr = [];
    for(let i=0; i<allDice.length; i++){
        allDice[i] = allDice[i].value;
    }
    let mode = getMode(allDice);
    switch (target.name){
        case 'ones':
            outArr = allDice.filter(i => i===1);
            break;
        case 'twos':
            outArr = allDice.filter(i => i===2);
            break;
        case 'threes':
            outArr = allDice.filter(i => i===3);
            break;
        case 'fours':
            outArr= allDice.filter(i => i===4);
            break;
        case 'fives':
            outArr= allDice.filter(i => i===5);
            break;
        case 'sixes':
            outArr= allDice.filter(i=>i ===6);
            break;
        case 'chance':
            outArr=allDice;
            break;
        case 'threeOfAKind':
            if(mode.modeLength >=3){
                outArr=allDice;
            }else{
                outArr=[];
            }
            break;
        case 'fourOfAKind':
                if(mode.modeLength >= 4){
                    outArr=allDice;
                    break;
                }else{
                    outArr=[];
                }
                break;
        case 'fullHouse':
                if(mode.modeLength ===5 || (mode.modeLength === 3 && mode.secondModeLength === 2)){
                    return 25;
                } else{
                    outArr=[];
                    break;
                }
        case 'yahtzee':
                if(mode.modeLength === 5){
                    target.yahtzee += 1;

                }else{
                    outArr=[];
                    break;
                }
        case 'lgStraight':
            let sorted = allDice.sort();
                if(arrayEquals(sorted,[1, 2, 3, 4, 5]) || arrayEquals(sorted==[2, 3, 4, 5, 6])){
                    return 40;
                }else{
                    outArr=[];
                    break;
                }
        case 'smStraight':
                let arr = removeRepeats(allDice.sort());
                if(arr.length >=4){
                    for(let i=1; i<arr.length; i++){
                        if(arr[i] !== arr[i-1]+1){
                            outArr = [];
                            break;
                        }
                    }
                    return 30;
                }else{
                    outArr = [];
                    break;
                }
                
        }
    if(outArr.length === 0){
        return '---';
    }
    return outArr.reduce((a,b)=>a+b);
}

function arrayEquals(a, b){
    if (a===b) return true;
    if(a==null || b==null) return false;
    if (a.length!= b.length) return false;

    for (let i=0;i<a.length;++i){
        if(a[i] !== b[i]) return false;
    }
    return true;
}


/* rollDice rolls every die object in the diceIn
    field, displays them, increments rollcount,
    and removes rollbtn */
function rollDice(){
    let timer = 5;
    rollbtn.removeEventListener('click', rollDice);
    rollbtn.style.opacity = 0.4;
    for(var z=0; z<timer; z++){
         setTimeout(function(){
           for(var i=0; i<diceIn.arr.length; i++){
                diceIn.arr[i].roll();
          }
            diceIn.disp();
         }, z*120);
    }
    setTimeout(function(){
    diceIn.disp();
    diceIn.addSelectors();
    rollCount += 1;
    if(rollCount === 3){
        rollCount += 1;
    } else{
        rollbtn.addEventListener('click', rollDice);
        rollbtn.style.opacity = 1;
    }
    }, timer*120+1);
}

/* getMode returns an object with mode, modeLength,
    secondMode, secondModeLength */
function getMode(arr){
    arr = arr.sort();
    let value = 0;
    let index = 0;
    let len = 0;
    let modeBelow = 0;
    let modeBelowIndex = 0;
    for(let i=0; i<arr.length; i++){
        len = arr.filter(a => a === arr[i]).length;
        if(len >= index){
            if(value != arr[i]){
            modeBelow = value;
            modeBelowIndex = index;
            index = len;
            value = arr[i];
            }
        }else if(len >= modeBelowIndex && arr[i] != value){
            modeBelow = arr[i];
            modeBelowIndex = len;
        }
    }
    return {
        mode: value,
        modeLength: index,
        secondMode: modeBelow,
        secondModeLength: modeBelowIndex
    };
}

// removeRepeats returns arr with repeats removed
function removeRepeats(arr){
    let out = [];
    for(let i=0; i<arr.length; i++){
        if(out.includes(arr[i])===false){
            out.push(arr[i]);
        }
    }
    return out;
}

function checkForWin(){
    if([...playerScore.getScores(), ...opScore.getScores()].indexOf(-1) === -1){
        playerScore.dispTotals;
        opScore.dispTotals;
    }
}

window.onload = function(){
    for(let i=0; i<5; i++){
        diceIn.arr.push(new Dice(i));
    }
    diceIn.disp();
    diceOut.disp();
}