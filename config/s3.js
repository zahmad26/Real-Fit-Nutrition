const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region: bucketRegion,
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});

// upload a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  //   console.log(fileStream);
  console.log(bucketName);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  return s3.upload(uploadParams).promise();
}

exports.uploadFile = uploadFile;

// get a file from s3
function getFile(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };
  return s3.getObject(downloadParams).createReadStream();
}

exports.getFile = getFile;

function deleteFile(filekey) {
  const deleteParams = {
    Key: filekey,
    Bucket: bucketName,
  };
  return s3.deleteObject(deleteParams).promise();
}

exports.deleteFile = deleteFile;
