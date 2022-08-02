const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');

const packageDef = protoLoader.loadSync('calc.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const calcPackage = grpcObj.calcPackage;

const handleInput = input => {
    const str = input.toString();

    if (str.toLowerCase() === "bye") {
        return false;
    }

    const terms = str.split(' ');

    return { 'op': terms[0], 'term1': Number.parseInt(terms[1]), 'term2': Number.parseInt(terms[2]) };
}

const client = new calcPackage.Calc("127.0.0.1:3000", grpc.credentials.createInsecure());

console.log('Type your question as "op num1 num2" (op = {+, -, /, *}):\n');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.addListener('line', line => {
    line = handleInput(line);
    
    if (!line) {
        console.log('end');
        rl.close();
    } else {
        client.calculate(line, (err, response) => {
            if (err) {
                console.log(`Something went wrong: ${err.message}\n`);
            } else {
                console.log(`Result: ${response.result}\n`);
            }
        });
    }
});