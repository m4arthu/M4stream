import {
    jest,
    expect,
    describe,
    test,
    beforeEach
} from '@jest/globals'

import {
    Controller
} from '../../../server/controller.js'

import {
    Service
} from '../../../server/service.js'

import TestUtill from '../_utill/testUtill'

describe('#Controller - test suite for controller calls', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test('#getFileStream', async () => {
        const mockStream = TestUtill.generateReadbleStream(['test'])
        const mockType = '.html'
        const mockFileName = 'test.html'

        jest.spyOn(
            Service.prototype,
            Service.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockStream,
            type: mockType
        })

        const controller = new Controller()
        const {
            stream,
            type
        } = await controller.getFileStream(mockFileName)

        expect(stream).toStrictEqual(mockStream)
        expect(type).toStrictEqual(mockType)
    })
})
