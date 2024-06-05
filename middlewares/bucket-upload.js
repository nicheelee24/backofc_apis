// const env = require("../environment");
import AWS from "aws-sdk"
import * as fs from "fs"

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
  s3BucketEndpoint: false,
  // s3ForcePathStyle: true
  // useDualstackEndpoint:true,
  // signatureVersion: "v4",
});

const s3Client = new AWS.S3();
export const audioUploadPromise = (file, Key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    s3Client.upload(params,(err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

export const getSignedUrl = (Key, contentType) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key,
      Expires: 6000,
      ACL: "public-read",
      ContentType: contentType
    };
    s3Client.getSignedUrl("putObject", params, (err, url) => {
      if (err) reject(err);
      resolve(url);
    });
  });
};

export const getSignedUrlToViewObject = (Key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key,
      Expires: 6000,
    };
    s3Client.getSignedUrl("getObject", params, (err, url) => {
      if (err) reject(err);
      resolve(url);
    });
  });
};



export const uploadPromise = (file, Key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key,
      Body: fs.readFileSync(file),
      ContentType: 'image/jpeg'
    };
    s3Client.upload(params,(err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export const downloadFilePromise = (Key) => {
  return new Promise((resolve, reject) => {
    const params = { Bucket: process.env.AWS_BUCKET, Key };
    console.log(params);
    
    s3Client.getObject(params,(err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

export const deleteBackUpUploadPromise = (Key) => {
  return new Promise((resolve, reject) => {
    const params = { Bucket: process.env.AWS_BUCKET, Key }

    s3Client.deleteObject(params, (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
};

export const startUploadAndCreateUploadId = (Key) => {
  const params = {
    Key,
    Bucket: process.env.AWS_BUCKET
  };
  return new Promise((resolve, reject) => {
    s3Client.createMultipartUpload(params, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  })
}

export const uploadPart = (buffer, uploadId, partNumber, fileName) => {
  const params = {
    Key: fileName,
    Bucket: process.env.AWS_BUCKET, 
    Body: buffer,
    PartNumber: partNumber, // number from one to 10.000
    UploadId: uploadId, // UploadId returned from the first method
  };
  
  return new Promise((resolve, reject) => {
    s3Client.uploadPart(params, (err, data) => {
      // console.log(data)
      if (err) reject({ PartNumber: partNumber, error: err });
      resolve({ PartNumber: partNumber, ETag: data.ETag });
    });
  });
}

export const abortUpload = async (uploadId, fileName) => {
  const params = {
    Key: fileName,
    Bucket: process.env.AWS_BUCKET,
    UploadId: uploadId,
  };

  return new Promise((resolve, reject) => {

    s3Client.abortMultipartUpload(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

export const listPart = (uploadId, key) => {
  const params = {
    Key: key,
    BucketId: process.env.AWS_BUCKET
  }
  s3Client.listParts()

}
export const completeUpload = async (uploadId, parts, fileName) => {
  const params = {
    Key: fileName,
    Bucket: process.env.AWS_BUCKET,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  };

  return new Promise((resolve, reject) => {
    s3Client.completeMultipartUpload(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}