var button = document.getElementById('subbtn');
button.addEventListener('click', fizzBuzz);


function fizzBuzz(){
    var fizz = document.getElementById('fizz').value;
    var buzz = document.getElementById('buzz').value;
    var limit = document.getElementById('fblimit').value;
    var output = document.getElementById('output');
    if(limit>10000){
        alert('Please keep limits reasonable (below 10,000)');
        document.getElementById('fblimit').value = '100';
        return false;
    }

    fizz = (fizz==='')?3:fizz;
    buzz = (buzz==='')?5:buzz;
    limit = (limit==='')?100:limit;

    let outArr=[];
    let out='';
    for(let i=1; i<=limit; i++){
        out = '';
        out += ((i%fizz) === 0)? 'Fizz' : '';
        out += ((i%buzz) === 0)? 'Buzz' : '';
        out = ((out==='')?i:out);
        outArr.push(out);
    }
    output.innerHTML = outArr;
    return false;
}