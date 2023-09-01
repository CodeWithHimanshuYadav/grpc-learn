const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "../file-validation.proto";
const protoLoader = require("@grpc/proto-loader");
// const validateToken = require("./auth");
// const fs = require("fs");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

/** load proto files */
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
/** load package definition from proto file */
const package = grpc.loadPackageDefinition(packageDefinition);

/** grpc server */
const server = new grpc.Server();
/** add service to the server */
server.addService(package.FileValidationPackage.FileValidation.service, {
    validateSize: (call, callback) => {
        // console.log("Peer ", request.getPeer())
        // const token = request?.metadata?.internalRepr.get("authorization")?.[0]?.split(" ")?.[1] ?? "";
        // console.log("token ", token);
        // validateToken(token);
        const { file, maxSize } = call.request;
        const isValid = file.size <= maxSize;
        callback(null, {
            isValid,
            message: isValid ? "File size is in range" : "File size has crossed the max limit"
        });
    },
    validateFileMimeType: (call, callback) => {
        const { file, allowedMimeTypes } = call.request;
        const isValid = allowedMimeTypes.includes(file?.mimeType);
        callback(null, {
            isValid ,
            message: isValid ? "Success" : "Failed"
        });
    }
});

const serverCreds = grpc.ServerCredentials.createInsecure();

/** server will listen on localhost:50051 */
server.bindAsync(
    "127.0.0.1:50051",
    serverCreds,
    (error, port) => {
        console.log(`Server running at http://127.0.0.1:${port}`);
        server.start();
    }
);