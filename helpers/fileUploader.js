const path = require("path");

const { v4: uuidv4 } = require("uuid");

const fileUploader = (
  files,
  allowedExtensions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const fileName = file.name.split(".");
    const extension = fileName[fileName.length - 1];

    // Validate extension
    if (!allowedExtensions.includes(extension)) {
      return reject(
        `The extension .${extension} is not allowed. Allowed extensions: ${allowedExtensions}`
      );
    }

    const tempName = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, tempName);

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(tempName);
    });
  });
};

module.exports = {
  fileUploader,
};
