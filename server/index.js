const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "../file-validation.proto";
const protoLoader = require("@grpc/proto-loader");

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
        const { file, maxSize } = call.request;
        const isValid = file.size <= maxSize;
        callback(null, {
            isValid,
            message: isValid ? "File size is in range" : "File size has crossed the max limit"
        });
    },
    validateFileMimeType: async (call, callback) => {
        const { file, allowedMimeTypes } = call.request;
        const fileType = await (async () => {
            const { fileTypeFromBuffer } = await import('file-type');

            const type = await fileTypeFromBuffer(file.content);
            console.log(type, "  ", file.mimeType);
            return type.mime
        })();
        console.log("length " ,file.content.length, " ", file.size);
        const isValid = allowedMimeTypes.includes(fileType);

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