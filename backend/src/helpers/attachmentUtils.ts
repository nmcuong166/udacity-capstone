import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
const AWSXRay = require('aws-xray-sdk');
import * as uuid from 'uuid'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('Attach file storage')

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

// TODO: Implement the fileStogare logic
export class AttachmentUtils {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {
  }

  async updateAttachmentUrl(todoId: string, userId: string, url: string): Promise<string> {
    logger.info('Update attachment url of todo')

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: "set attachmentUrl = :url",
      ExpressionAttributeValues: {
        ":url": url,
      }
    }).promise()
  
    return url
  }

  async createAttachmentPresignedUrl (todoId: string, userId: string) {
    logger.info('create attachment presigned url')
    const imageId = uuid.v4()
    const url = `https://${this.bucketName}.s3.amazonaws.com/${imageId}`
    await this.updateAttachmentUrl(todoId, userId, url)
    return this.getUploadUrl(imageId)
  }
  
  getUploadUrl(imageId: string) {
    logger.info('get upload url')
    logger.info('urlExpiration:', this.urlExpiration)
    return s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: imageId,
      Expires: Number(this.urlExpiration)
    })
  }
}