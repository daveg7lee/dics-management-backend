import * as bcrypt from 'bcrypt';
import * as AWS from 'aws-sdk';
import { User } from '../users/entities/user.entity';

const region = 'ap-northeast-2';
const Bucket = 'dics-bucket';

AWS.config.update({
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
  region,
});

const S3 = new AWS.S3();

export const checkPassword = async (
  password: string,
  user: Partial<User>,
): Promise<boolean> => {
  try {
    const ok = await bcrypt.compare(password, user.password);
    return ok;
  } catch (e) {
    console.log(e);
  }
};

export const uploadToS3 = async (file, userId, folderName) => {
  const { createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${
    Date.now() * 100000
  }-${Math.random()}-${Math.random() * 100}`;
  const { Location } = await S3.upload({
    Bucket,
    Key: objectName,
    ACL: 'public-read',
    Body: readStream,
  }).promise();
  return Location;
};

export const deleteInS3 = async (fileUrl) => {
  const Key = fileUrl.replace(
    `https://${Bucket}.s3.${region}.amazonaws.com/`,
    '',
  );
  await S3.deleteObject({
    Bucket,
    Key,
  }).promise();
};
