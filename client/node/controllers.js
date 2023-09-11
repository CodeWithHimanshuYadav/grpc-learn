const client = require("./grpc-client");

const fileUploadController = async (req, res) => {
    const file = Object.values(req.files)[0];
    // validateSize(file);
    validateMediaType(file);
    res.send({
        success: true /** hardcoded here, please don't do so in development/production */
    });
}

const validateSize = (file) => {
    const validateSizeRequest = {
        file: {
            content: file.data,
            name: file.name,
            mimeType: file.mimetype,
            size: file.size,
        },
        maxSize: 1024 * 1024,
    };

    client.validateSize(validateSizeRequest, (error, { isValid, message }) => {
        if (!error) {
            console.log('Validation Result:', isValid);
            console.log('Validation Message:', message);
        } else {
            console.error('Error:', error);
        }
    });
}

const validateMediaType = (file) => {
    // Example: Calling the validateFileMimeType RPC method
    const validateMimeTypeRequest = {
        file: {
            content: file.data,
            name: file.name,
            mimeType: file.mimetype,
            size: file.size,
        },
        allowedMimeTypes: ['text/plain', 'application/pdf'], // Replace with your allowed MIME types
    };

    client.validateFileMimeType(validateMimeTypeRequest, (error, response) => {
        if (!error) {
            console.log('Validation Result:', response.isValid);
            console.log('Validation Message:', response.message);
        } else {
            console.error('Error:', error);
        }
    });

}

module.exports = fileUploadController;
