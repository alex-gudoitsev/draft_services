import * as AWS from 'aws-sdk';
import { BUCKET, PARSED_DIR, UPLOADED_DIR } from 'src/constants';
import { ICar } from 'src/types';
const csv = require('csv-parser');

export class FileService {
  private readonly s3 = new AWS.S3({ region: 'us-east-1' });

  private async moveParsedFile(key: string) {
    console.log('start moveParsedFile');
    const targetKey = key.replace(UPLOADED_DIR, PARSED_DIR);

    await this.s3
      .copyObject({
        Bucket: BUCKET,
        CopySource: `${BUCKET}/${key}`,
        Key: targetKey,
      })
      .promise();

    await this.s3
      .deleteObject({
        Bucket: BUCKET,
        Key: key,
      })
      .promise();
  }

  public async parseFile(key: string): Promise<ICar[]> {
    return new Promise((resolve, reject) => {
      console.log('start parseFile');
      const readList = [];
      const stream = this.s3
        .getObject({
          Bucket: BUCKET,
          Key: key,
        })
        .createReadStream();

      stream
        .pipe(
          csv({
            headers: ['title', 'description', 'price', 'count'],
            mapValues: ({ header, value }) =>
              ['price', 'count'].includes(header) ? Number(value) : value,
          })
        )
        .on('data', (data) => {
          readList.push(data);
        })
        .on('end', () => {
          this.moveParsedFile(key)
            .then(() => resolve(readList))
            .catch(console.error);
        })
        .on('error', reject);
    });
  }
}

const service = new FileService();
export default service;
