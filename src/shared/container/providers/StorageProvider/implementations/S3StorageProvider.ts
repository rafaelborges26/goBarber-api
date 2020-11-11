import fs from 'fs'
import aws, {S3} from 'aws-sdk'
import mime from 'mime'
import path from 'path'
import uploadConfig from '@config/upload'
import IStorageProvider from '../models/IStorageProvider'


class DiskStorageProvider implements IStorageProvider {
    private client: S3

    constructor() {
        this.client = new aws.S3({
            region: 'us-east-2'
        })
    }
    public async saveFile(file: string): Promise<string> {

            const originalPath = path.resolve(uploadConfig.tmpFolder, file)

            const ContentType = mime.getType(originalPath)

            if(!ContentType) {
                throw new Error('File not found')
            }

            const fileContent = await fs.promises.readFile(originalPath)

            await this.client.putObject({
                Bucket: uploadConfig.config.aws.bucket, //nome da pastinha de bucket criada
                Key: file, //qual sera nome do arquivo
                ACL: 'public-read', //permissoes
                Body: fileContent, //conteudo do arquivo
                ContentType,
            }).promise()

            await fs.promises.unlink(originalPath)//dps de add na aws exclui o arquivo localmente

            return file
    }

    public async deleteFile(file:string): Promise<void> {
        await this.client.deleteObject({
            Bucket: uploadConfig.config.aws.bucket,
            Key: file
        }).promise()

    }
}

export default DiskStorageProvider
