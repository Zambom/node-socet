const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('calc.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const calcPackage = grpcObj.calcPackage;

const calculator = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '/': (x, y) => {
        if (y === 0) {
            return "Invalid operation (division by zero)";
        }

        return x / y;
    },
    '*': (x, y) => x * y,
}

const validate = req => {
    if (req.op == null || req.term1 == null || req.term2 == null) {
        return false;
    }
    
    return true;
}

const calculate = (call, callback) => {
    if (!validate(call.request)) {
        return callback({ message: "Missing parameters.", code: grpc.status.INVALID_ARGUMENT });
    }

    const { op, term1, term2 } = call.request;

    const func = calculator[op];

    if (typeof(func) === 'undefined') {
        return callback({ message: "Invalid operation.", code: grpc.status.NOT_FOUND });
    }

    callback(null, { "result": func(term1, term2) });
}

const server = new grpc.Server();
server.bind("0.0.0.0:3000", grpc.ServerCredentials.createInsecure());

server.addService(calcPackage.Calc.service, {
    'calculate': calculate
});

server.start();

