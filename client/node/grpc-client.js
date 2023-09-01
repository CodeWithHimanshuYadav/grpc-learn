const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "../../file-validation.proto";

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};
/** load proto file */
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
/** load service file */
const Service = grpc.loadPackageDefinition(packageDefinition).FileValidationPackage.FileValidation;

const credentials = grpc.credentials.createInsecure();
const client = new Service(
    "localhost:50051",
    credentials
);

module.exports = client;

