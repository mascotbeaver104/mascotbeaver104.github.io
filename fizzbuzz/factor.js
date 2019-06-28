function primeFactors() {
    number = document.getElementById('factorIn').value;
    if(number === '' || /^\d+$/.test(number)===false){
        return false;
    }
    if(number>999999999){
        if(confirm('This number is very large and may break your browser. Are you sure you want to continue?')===false){
            return false;
        }
    }
    let factors = [1,1];
    let i=2;
    while(number !== 1){
        if(number%i===0 && isPrime(i)){
          factors.push(i);
          number = number/i;
          i = 2;
        } else{
            i++;
        }
      }

    factors = factors.slice(2);
  
    let output=document.getElementById('factorOut');
    output.innerHTML = factors;
    return false;
  }

  function isPrime(n){
    for(let i=2; i<=n/2; i++){
      if(n%i===0){
        return false;
      }
    }
    return true;
  }