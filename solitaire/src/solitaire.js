/*
    DO NOT CONCAT selected TO stacks USE addBack() INSTEAD
    Some stack arrays will get diordered if concat is used
    to return the selected cards, use addBack() instead.

    FUNCTION DIRECTORY

    createDeck(): creates and shuffles 52 card objects the deck
        and erases the current draw pile.

    deal(): Calls createDeck, then distributes cards to the stacks
        to start the game.

    dispStack(), dispCards(), dispAce and dispDeck(): update the display on the
        card stacks, draw pile, and deck respectively.

    DispStack() will call the appropriate disp() if a wrong type is passed to it.

    updateAll(): Updates all displays. Calls dispStack() for all stacks,
        dispCards(), and dispDeck().

    draw(): Called on click of deck. Moves 3 cards from the deck to the
        drawpile, and updates displays. If deck is empty, it will
        replenish from the draw pile.

    isLegal(stack): Returns true if it is legal to place the selected card
        array onto a stack.

    addBack(): returns selected cards back to their array.
*/
var deck = [];
var selected = {
    arr: [],
    home: stackOne,
    dblclick: false
};
var cardBack = "./src/images/cards/card_back.svg";
var cardBlank = './src/images/cards/blank.svg';
class Stack {
  constructor(stackName) {
    this.name = stackName;
    this.elem = document.getElementById(stackName);
    this.arr = [];
  }
}
class Ace extends Stack{
    constructor(stackName){
        super(stackName);
    this.suit = 'unset';
    }
}
var stackOne = new Stack("stackOne");
var stackTwo = new Stack("stackTwo");
var stackThree = new Stack("stackThree");
var stackFour = new Stack("stackFour");
var stackFive = new Stack("stackFive");
var stackSix = new Stack("stackSix");
var stackSeven = new Stack("stackSeven");
var aceOne = new Ace('aceOne');
var aceTwo = new Ace('aceTwo');
var aceThree = new Ace('aceThree');
var aceFour = new Ace('aceFour');
var drawn = new Stack('cards');
var decklen = 3;
var drawCount = 0;

class Card {
  constructor(value, suit, numValue) {
    this.value = value;
    this.numValue = numValue;
    this.suit = suit;
    this.faceUp = true;
    this.imgSrc = "./src/images/cards/" + String(value) + "_of_" + suit + ".svg";
  }
}
function createDeck() {
  //creates an array of 52 shuffled unique card objects
  deck = [];
  drawn.arr = [];
  stackOne.arr = [];
  stackTwo.arr = [];
  stackThree.arr = [];
  stackFour.arr = [];
  stackFive.arr = [];
  stackSix.arr = [];
  stackSeven.arr = [];
  selected.arr = [];
  aceOne.arr = [];
  aceTwo.arr = [];
  aceThree.arr = [];
  aceFour.arr = [];
  updateAll();
  drawCount = 0;
  let tempDeck = [];
  let rand = 0;
  for (let i = 1; i <= 52; i++) {
    tempDeck.push(i);
  }
  for (let i = 0; i < 52; i++) {
    rand = Math.floor(Math.random() * tempDeck.length);
    deck.push(tempDeck[rand]);
    tempDeck.splice(rand, 1);
  }
  function createCards() {
    //generates 52 card objects;
    let cardVal = 0;
    let cardSuit = 0;
    for (let z = 0; z < 52; z++) {
      let i = deck[z];
      if (i / 13 <= 1) {
        cardSuit = "clubs";
      } else if (i / 13 <= 2) {
        cardSuit = "hearts";
      } else if (i / 13 <= 3) {
        cardSuit = "diamonds";
      } else if (i / 13 <= 4) {
        cardSuit = "spades";
      }
      cardVal = (i % 13) + 1;
      if (cardVal === 11) {
        cardVal = "jack";
      } else if (cardVal === 12) {
        cardVal = "queen";
      } else if (cardVal === 13) {
        cardVal = "king";
      } else if (cardVal === 1) {
        cardVal = "ace";
      }
      cardVal = String(cardVal);
      drawn.arr.push(new Card(cardVal, cardSuit, i%13));
    }
  }
  createCards();
  deck = drawn.arr;
  drawn.arr = [];
}
function addBack(stack, array){
    if(stack === drawn){
        stack.arr.splice(0, 0, ...array);
    }else{
        stack.arr = stack.arr.concat(array);
    }
}
function isZero(num){
  if(num === 0){
    return 0;
  }
  else{
    return 1;
  }
}
function dispStack(stack) {
  //takes stack object and displays the card array
  if(stack === drawn){
      dispCards();
      return;
  }
  if(stack.suit !== undefined){
        dispAce(stack);
        return;
  }
  let stackEnd = stack.arr.length - 1;
  let spaceIndex = 0;
  stack.elem.innerHTML = "";
  if(stack.arr.length===0){
    isBlank(stack);
    return;
  }
  if (stack.arr[stackEnd].faceUp === false) {
    stack.arr[stackEnd].faceUp = true;  
  }
  for (let i = 0; i < stack.arr.length; i++) {
    let pic = document.createElement("img");
    stack.elem.appendChild(pic);
    pic.className = "cardPic";
    pic.style.zIndex = String(i);
    pic.style.marginTop = spaceIndex*15 + '%';
    if (stack.arr[i].faceUp) {
      pic.setAttribute("src", stack.arr[i].imgSrc);
      spaceIndex += 1.5;
     pic.addEventListener('click', function(){
        if(selected.arr.length === 0){
            let len = stack.arr.length;
                for(let z=i; z<len; z++){
                    selected.arr.unshift(stack.arr.pop());
                }
            selected.home = stack;
            pic.style.border = '5px solid gold';
            pic.style.borderBottom = 'none';
            pic.style.borderRadius = '8%';
            pic.style.alignSelf = 'center';
             return;
        }else if(i === stack.arr.length-1){
          if(isLegal(stack)===true){
              if(selected.home === drawn){
                drawCount = 0;
              }
              stack.arr = stack.arr.concat(selected.arr);
              dispStack(stack);
              selected.arr = [];
              dispStack(selected.home);
              selected.home = undefined;
              return;
          }else{
            addBack(selected.home, selected.arr);
            dispStack(selected.home);
            selected.home = undefined;
            selected.arr = [];
            return;
          }    
      } else{
        addBack(selected.home, selected.arr);
        dispStack(selected.home);
        selected.home = undefined;
        selected.arr = [];
        return;
      }
    });
  pic.addEventListener('dblclick', function(){
    if(selected.arr.length === 0){
      let len = stack.arr.length;
          for(let z=i; z<len; z++){
              selected.arr.unshift(stack.arr.pop());
          }
      selected.home = stack;
      let found = findLegal(stack);
      if(found !== false){
        found.arr.push(...selected.arr);
        dispStack(found);
        dispStack(stack);
        selected.arr =[];
        selected.home = undefined;
      }else{
        addBack(selected.home, selected.arr);
        dispStack(selected.home);
        selected.home = undefined;
        selected.arr = [];
        return;
      }
        } else{
          addBack(selected.home, selected.arr);
          dispStack(selected.home);
          selected.home = undefined;
          selected.arr = [];
          return;
        }
    
  });
    } else {
      pic.setAttribute("src", cardBack);
      spaceIndex += 0.5;
    }
  }
}

function findLegal(stack){
  var stackArr = [aceOne, aceTwo, aceThree, aceFour, stackOne, stackTwo, stackThree, stackFour, stackFive, stackSix, stackSeven];
  for(let i=0; i<stackArr.length; i++){
    if(isLegal(stackArr[i]) && stackArr[i] !== stack){
      return stackArr[i];
    }
  }
  return false;
}

function getColor(card){
    if(card.suit === 'clubs' || card.suit === 'spades'){
        return 'black';
    }else{
        return 'red';
    }

}
function isUndrawLegal(){
  if(selected.home === drawn || drawn.arr.length === 0 || drawCount<1){
    undrawLegal(false);
  }
}
function isLegal(stack){
    let lastCard = stack.arr[stack.arr.length-1];
    if(stack.suit !== undefined){
        if(selected.arr.length === 1){
            if(stack.suit === 'unset' && selected.arr[0].value === 'ace'){
              isUndrawLegal();
              return true;
            }else if(selected.arr[0].suit === stack.suit && selected.arr[0].numValue === (lastCard.numValue+1)){
              isUndrawLegal();
              return true;
            } 
        }
         return false;
    }   else{
    if(stack.arr.length === 0){
        if(selected.arr[0].value === 'king'){
            isUndrawLegal();
            return true;
        } else{
            return false;
        }
    }
    if(selected.arr[0].numValue === lastCard.numValue-1
        && getColor(selected.arr[0]) !== getColor(lastCard)){
            isUndrawLegal();
            return true;
        } else{
            return false;
        }
    }
}
function deal() {
  createDeck();
  for (let i = 7; i > 0; i--) {
    switch (i) {
      case 7:
        stackOne.arr.push(deck.pop());
        stackOne.arr[7-i].faceUp = false;
      case 6:
        stackTwo.arr.push(deck.pop());
        stackTwo.arr[7-i].faceUp = false;
      case 5:
        stackThree.arr.push(deck.pop());
        stackThree.arr[7-i].faceUp = false;
      case 4:
        stackFour.arr.push(deck.pop());
        stackFour.arr[7-i].faceUp = false;
      case 3:
        stackFive.arr.push(deck.pop());
        stackFive.arr[7-i].faceUp = false;
      case 2:
        stackSix.arr.push(deck.pop());
        stackSix.arr[7-i].faceUp = false;
      case 1:
        stackSeven.arr.push(deck.pop());
        stackSeven.arr[7-i].faceUp = false;
        break;
      default:
        break;
    }
  }
  updateAll();
  undrawLegal(false);
  dispDeck();
}
function dispDeck() { //displays the deck
  document.getElementById("deck").innerHTML = "";
  let foldOut = deck.length;
  if (foldOut > 3) {
    foldOut = 3;
  }
  for (let i = 0; i < foldOut; i++) {
    let pic = document.createElement("img");
    document.getElementById("deck").appendChild(pic);
    pic.className = "cardPic";
    pic.style.zIndex = String(4 + i);
    pic.style.left = i*.5 + "vw";
    pic.setAttribute("src", "./src/images/cards/card_back.svg");
  }
  if(foldOut === 0){
    let pic = document.createElement("img");
    document.getElementById("deck").appendChild(pic);
    pic.className = "cardPic";
    pic.style.left = '0px';
    pic.setAttribute("src", "./src/images/cards/recycle.svg");
    pic.style.zIndex = 5;
  }
}
function dispCards(){ //displays the drawn cards
    let cardStack = document.getElementById('cards');
    cardStack.innerHTML = '';
    for(let i=0; i<3; i++){
        if(i < drawn.arr.length){
            let pic = document.createElement('img')
            cardStack.appendChild(pic);
            pic.setAttribute("src", drawn.arr[i].imgSrc);
            pic.className = 'cardPic';
            pic.style.zIndex = String(3-i);
            pic.style.right = i*10 + '%';
            pic.style.top = '0px';
            if(i===0){
                pic.addEventListener('click', function(){

                    if(selected.arr.length === 0){
                        selected.arr.push(drawn.arr.shift());
                        pic.style.border = '5px solid gold';
                        pic.style.borderRadius = '8%';
                        selected.home = drawn;
                    }else{
                        addBack(selected.home, selected.arr);
                        dispStack(selected.home);
                        selected.home = undefined;
                        selected.arr = [];
                        return;
                    }

                });
                pic.addEventListener('dblclick', function(){
                  if(selected.arr.length === 0){
                    selected.arr.push(drawn.arr.shift());
                    selected.home = drawn;
                    drawCount = 0;
                    let found = findLegal(drawn);
                    if(found !== false){
                      found.arr.push(...selected.arr);
                      dispStack(found);
                      dispCards();
                      selected.arr =[];
                      selected.home = undefined;
                    } else{
                      addBack(selected.home, selected.arr);
                      dispStack(selected.home);
                      selected.home = undefined;
                      selected.arr = [];
                      return;
                    }
                      } else{
                        addBack(selected.home, selected.arr);
                        dispStack(selected.home);
                        selected.home = undefined;
                        selected.arr = [];
                        return;
                      }
                  
                });
              
            }
        }
    }
}
function dispAce(stack){
    let topCard = stack.arr[stack.arr.length-1];
    stack.elem.innerHTML = '';
    if(stack.arr.length===0){
        stack.suit = 'unset';
        isBlank(stack);
        return;
    }else{
    stack.suit = stack.arr[0].suit;
    let cardStack = document.getElementById(stack.elem);
    let pic = document.createElement('img')
    stack.elem.appendChild(pic);
    pic.setAttribute("src", topCard.imgSrc);
    pic.className = 'cardPic';
    pic.addEventListener('click', function(){
        if(selected.arr.length === 0){
            selected.arr.push(stack.arr.pop());
            selected.home = stack;
            pic.style.border = '5px solid gold';
            pic.style.borderRadius = '8%';
            pic.style.alignSelf = 'center';
            return;

        }   else if(stack.arr.length === 0){
            if(selected.home === stack){
                stack.arr.push(selected.arr.pop());
                dispAce(stack);
                selected.home = undefined;
            }

        } else if(isLegal(stack)===true){
          if(selected.home === drawn){
            drawCount = 0;
          }
            stack.arr.push(selected.arr.pop());
            dispStack(selected.home);
            selected.arr.home = 'undefined';
            dispAce(stack);
            return;

        } else{
            addBack(selected.home, selected.arr);
            dispStack(selected.home);
            selected.home = undefined;
            selected.arr = [];
            return;
        }
    });
    checkWin();
    }
}
function checkWin(){
    if(aceOne.arr.length === 13 &&
        aceTwo.arr.length === 13 &&
        aceThree.arr.length == 13 &&
        aceFour.arr.length == 13){
            if(confirm('You Won!\n\n Start a new game?')){
                deal();
            }else{
                return;
            }
        }
}
function isBlank(stack){
    let blank = document.createElement("img");
    blank.setAttribute('src', cardBlank);
    stack.elem.appendChild(blank);
    blank.className = "cardPic";
    blank.addEventListener('click', function(){
    if(selected.arr.length === 0){
        return;
   }else if(isLegal(stack)===true){
           stack.arr = selected.arr;
           dispStack(stack);
           selected.arr = [];
           dispStack(selected.home);
           selected.home = undefined;
           return;
       }else{
           addBack(selected.home, selected.arr);
         dispStack(selected.home);
         selected.home = undefined;
         selected.arr = [];
         return;
       }
    });
}
function updateAll() { //refreshes all HTML elements,
  dispStack(stackOne); // so they display their current array
  dispStack(stackTwo);
  dispStack(stackThree);
  dispStack(stackFour);
  dispStack(stackFive);
  dispStack(stackSix);
  dispStack(stackSeven);
  dispAce(aceOne);
  dispAce(aceTwo);
  dispAce(aceThree);
  dispAce(aceFour);
  dispCards();
  dispDeck();
}
function draw(){
    if(deck.length === 0){
        undrawLegal(false);
        deck = drawn.arr;
        drawn.arr = [];
        dispDeck();
        dispCards();
        drawCount = 0;
        return;
    }
    for(let i=0; i<3; i++){
      if(deck.length === 0){
        decklen = i;
        break;
      }
        if(deck.length>0){
            decklen = 3;
            drawn.arr.unshift(deck.pop());
        }
    }
    undrawLegal(true);
    drawCount += 1;
    dispDeck();
    dispCards();
}
function undrawLegal(legal){
  let btn = document.getElementById('undraw');
  if(legal === true){
    btn.style.opacity = 1;
    btn.addEventListener('click', undraw);
  }else if(legal === false || drawn.arr.length ===0){
    btn.style.opacity = 0.4;
    btn.removeEventListener('click', undraw);
  }
}
function undraw(){
    for(let i=0; (i<3 && i<decklen); i++){
        deck.push(drawn.arr.shift());
    }
    if(decklen<3){
      decklen = 3;
    }
    drawCount -= 1;
    if(drawn.arr.length===0 || drawCount ===0){
      undrawLegal(false);
    }
    dispCards();
    dispDeck();

}
document.getElementById('ng').onclick = function(){
  if(confirm('Start a new game?')){
    deal();
  }
  };
document.getElementById('deck').onclick = function(){draw()};
window.onload = function() {
    deal();
}