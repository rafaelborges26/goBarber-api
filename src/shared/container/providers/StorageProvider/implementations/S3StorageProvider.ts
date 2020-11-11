import fs from 'fs'
import aws, {S3} from 'aws-sdk'
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

            const fileContent = await fs.promises.readFile(originalPath, {
                encoding: 'utf-8',
            }) //ler o arquivo

            await this.client.putObject({
                Bucket: 'ap-gobarber', //nome da pastinha de bucket criada
                Key: file, //qual sera nome do arquivo
                ACL: 'public-read', //permissoes
                Body: fileContent //conteudo do arquivo
            }).promise()

            return file
    }

    public async deleteFile(file:string): Promise<void> {
        const filePath = path.resolve(uploadConfig.uploadsFolder, file)

        try{
            await fs.promises.stat(filePath) //se o arquivo existe

        }catch{
            return
        }

        await fs.promises.unlink(filePath) //exclui o arquivo
    }
}

export default DiskStorageProvider
