import fs from  'fs'
import fsPromises from 'fs/promises'
import config from './config.js'
import { randomUUID } from 'crypto'
import { PassThrough } from 'stream'
import throttle from 'throttle'
import { ChildProcess } from 'child_process'
import { 
    extname, 
    join 
}from 'path'
const {
    dir: {
        publicDirectory
    }
} = config
export class Service {
    constructor () {
      this.clientStreams = new Map()
    }

    createClientStream() {
      const id= randomUUID()
      const clientStream = new PassThrough()
      this.clientStreams.set(id, clientStream)

      return  {
          id,
          clientStream
      }
    }

    removeClientStream (id) {
        this.clientStreams.delete(id)
    }

    _executeSoxCommand(args) {
      return ChildProcess.spawn('sox', args)
    }

    async getBitRage(song) {
        
    }


    createFileStream(filename) {
        return fs.createReadStream(filename)
    }

    async getFileInfo(file) {
        // file = home/index.html
        const fullFilePath = join(publicDirectory, file)
        //valida se esxiste, se não mostra umm erro
        await fsPromises.access(fullFilePath)
        const filetype = extname(fullFilePath)
        return {
            type: filetype,
            name: fullFilePath
        }

    }

    async getFileStream(file) {
        const {
            name,
            type

        }= await this.getFileInfo(file)
        return {
            stream: this.createFileStream(name),
            type
        }
    }

}