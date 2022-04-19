import { jest } from '@jest/globals'
import { read } from 'fs'
import {
    Readable,
    Writable
} from 'stream'
import { handler } from '../../../server/routes'
export default class TestUtill {
   
    static generateReadbleStream(data) {
        return new  Readable({
            read() {
                for(const item of data) {
                    this.push(item)
                }

                this.push(null)
            }
        })
    }

    static generatWritableStream(onData) {
        return new  Writable ({
            write(chunk, enc, cb) {
                onData(chunk)
                cb(null, chunk)
            }
        })
    }
    static defaultHandlerParams() {
        const requestStream = TestUtill.generateReadbleStream(['body da requisição'])
        const response = TestUtill.generatWritableStream(() => {})
        const data = {
            request: Object.assign( requestStream,{
                headers: {},
                method: '',
                url:''
           }),
            response: Object.assign(response, {
                writeHead: jest.fn(),
                end: jest.fn()
            })
        }
        handler(data.request, data.response)
        return {
            values: () => Object.values(data),
            ...data
        }
    }
}