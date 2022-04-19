import {
    jest, 
    expect, 
    describe, 
    test,
    beforeEach
} from '@jest/globals'
import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'
import { handler } from '../../../server/routes.js'
import TestUtill from '../_utill/testUtill.js'
const {
pages,
location,
constants : {
    CONTENT_TYPE
}
} = config 
describe ('#Routes - test site for api response', () => {
    beforeEach(() =>{
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })
    test('GET / - should redirect to home page', async () => {
        const params = TestUtill.defaultHandlerParams()
        params.request.method = 'GET'
        params.request.url = '/'

        await handler(...params.values())

        expect(params.response.writeHead).toBeCalledWith(
            302,
            {
                'Location': location.home
            }
        )
        expect(params.response.end).toHaveBeenCalled()
    })
  
   test(`GET /home - should response with ${pages.homeHTML} filestram` , async () => {
    const params = TestUtill.defaultHandlerParams()
    params.request.method = 'GET'
    params.request.url = '/home'
    const mockFileStream = TestUtill.generateReadbleStream(['data'])
    
    jest.spyOn(
        Controller.prototype,
        Controller.prototype.getFileStream.name,
    ).mockResolvedValue({
        stream: mockFileStream,
    })

    jest.spyOn(
        mockFileStream,
        "pipe"
    ).mockReturnValue()
    
    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(pages.homeHTML)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
})
   test(`GET /controler - should response wich ${pages.controllerHTML}` , async () => {
    const params = TestUtill.defaultHandlerParams()
    params.request.method = 'GET'
    params.request.url = '/controller'
    const mockFileStream = TestUtill.generateReadbleStream(['data'])
    
    jest.spyOn(
        Controller.prototype,
        Controller.prototype.getFileStream.name,
    ).mockResolvedValue({
        stream: mockFileStream,
    })

    jest.spyOn(
        mockFileStream,
        "pipe"
    ).mockReturnValue()
    
    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(pages.controllerHTML)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
})
test(`GET /intex.html - should response wich file stram` , async () => {
    const params = TestUtill.defaultHandlerParams()
    const filename = "/index.html"
    params.request.method = 'GET'
    params.request.url = filename
    const mockFileStream = TestUtill.generateReadbleStream(['data'])
    const expectedType = '.html'
    
    jest.spyOn(
        Controller.prototype,
        Controller.prototype.getFileStream.name,
    ).mockResolvedValue({
        stream: mockFileStream,
        type: expectedType
    })

    jest.spyOn(
        mockFileStream,
        "pipe"
    ).mockReturnValue()
    
    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(filename)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    expect(params.response.writeHead).toHaveBeenCalledWith(
        200, {
            'Content-Type': CONTENT_TYPE[expectedType]
        }
    )
})
test(`GET /file.ext - should response wich file stram` , async () => {
    const params = TestUtill.defaultHandlerParams()
    const filename = "/file.ext"
    params.request.method = 'GET'
    params.request.url = filename
    const mockFileStream = TestUtill.generateReadbleStream(['data'])
    const expectedType = '.ext'
    
    jest.spyOn(
        Controller.prototype,
        Controller.prototype.getFileStream.name,
    ).mockResolvedValue({
        stream: mockFileStream,
        type: expectedType
    })

    jest.spyOn(
        mockFileStream,
        "pipe"
    ).mockReturnValue()
    
    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(filename)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    expect(params.response.writeHead).toHaveBeenCalled()
})
test(`GET /unknow - given  an  inexistent route it should response wich 404 not found`,  async () => {
    const params = TestUtill.defaultHandlerParams()
    params.request.method = 'GET'
    params.request.url = '/unknow'
    
    jest.spyOn(
        Controller.prototype,
        Controller.prototype.getFileStream.name,
    ).mockRejectedValue(new Error('Error: ENOENT:no such  file or  directory'))
    await handler(...params.values())

    expect(params.response.writeHead).toHaveBeenCalledWith(404) 
    expect(params.response.end).toHaveBeenCalled() 
}) 

       test('given an  error it  shold  respound with 500',  async () => {
        const params = TestUtill.defaultHandlerParams() 
        params.request.method = 'GET'
        params.request.url = '/index.png'
        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockRejectedValue(new Error('Error:'))  
        
        await handler(...params.values())

        expect(params.response.writeHead).toHaveBeenCalledWith(500)
        expect(params.response.end).toHaveBeenCalled()
       })
    })