let Task = require('../../src/model/task.model');
const imageService = require('../../src/services/image.service');
const fetch = require('node-fetch');
jest.mock('node-fetch', ()=>jest.fn());
const FormData = require('form-data');
const fs = require('fs-extra');
const domain = require('../../src/domain/task.domain');
const TaskStatus = require('../../src/constants/task.constants');

const mockTaskId = '64875c05f290ce514a2d41eb';

const taskModelSpy = {
    findById: jest.spyOn(Task, 'findById'),
    findByIdAndUpdate: jest.spyOn(Task, 'findByIdAndUpdate'),
    save: jest.spyOn(Task.prototype, 'save'),
    id: jest.spyOn(Task.prototype, 'id', 'get').mockResolvedValue(mockTaskId)
}

const FormDataSpy = {
    append: jest.spyOn(FormData.prototype, 'append').mockResolvedValue({})
}


const imageServiceSpy = {
    createImage: jest.spyOn(imageService, 'createImage')
}

const fsSpy = {
    createReadStream: jest.spyOn(fs, 'createReadStream')
}

const mockGeneratedImagesFiles = [
    {
        originalname: 'test-800.png',
        path: '/tmp/test-800.png'
    },
    {
        originalname: 'test-1024.png',
        path: '/tmp/test-1024.png'
    },
    {
        originalname: 'test.png',
        path: '/tmp/test.png'
    }
]


describe('Task domain test suite', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('manage create task', () => {
        
        test('should create task successfully', async () => {
            const mockFetchResponse = { status: 201 };
            taskModelSpy.save.mockResolvedValue({});
            imageServiceSpy.createImage.mockResolvedValue('/tmp');
            fsSpy.createReadStream.mockResolvedValue({});
            fetch.mockResolvedValue(mockFetchResponse);

            const createdTask = await domain.createTask(mockGeneratedImagesFiles[2]);
            expect(createdTask).toEqual(mockFetchResponse)
        });
        
        // test('should throw error if create task in database fails', async () => {
        //     const saveTaskError = new Error('Error saving task model');
        //     const createTaskError = new Error('Error creating task in database', { error: saveTaskError.message })
        //     taskModelSpy.save.mockRejectedValue(saveTaskError);
        //     await expect(domain.createTask(mockGeneratedImagesFiles[0])).rejects.toThrow(createTaskError)
        //     expect(imageServiceSpy.createImage).not.toHaveBeenCalled();
        // })
        test('should throw error if dispatch resize image function fails', async () => {
            const GCFunctionError = new Error('GCF error');
            const dispatchGCFunctionError = new Error('Error dispatching google cloud function', { error: GCFunctionError.message });
            
            fsSpy.createReadStream.mockResolvedValue({});
            taskModelSpy.save.mockResolvedValue({});
            taskModelSpy.findByIdAndUpdate.mockResolvedValue({});
            imageServiceSpy.createImage.mockResolvedValue('/tmp');
            fetch.mockRejectedValue(GCFunctionError);

            await expect(domain.createTask(mockGeneratedImagesFiles[2])).rejects.toThrow(dispatchGCFunctionError);
        });
    });
    
    describe('manage get task status', () => {
        test('should call get task detail', async () => {
            taskModelSpy.findById.mockResolvedValue({ status: 'PROCCESSING' })
            
            const status = await domain.getTaskStatus('dsfdsfsdf');
    
            expect(status).toEqual('PROCCESSING')
        })
        test('should throw error if get task status fails', async () => {
            const connectionDatabaseError = new Error('Error connecting to database');
            const getStatusError = new Error('Error getting task status', { error: connectionDatabaseError.message });
            taskModelSpy.findById.mockRejectedValue(connectionDatabaseError)
            
            await expect(domain.getTaskStatus('dsfdsfsdf')).rejects.toThrow(getStatusError);
        })
    });

    describe('manage generated images', () => {
        test('should create generated images', async () => {
            imageServiceSpy.createImage.mockResolvedValue({});
            taskModelSpy.findByIdAndUpdate.mockResolvedValue({});
            
            const generatedImages = await domain.generatedImages(mockTaskId, mockGeneratedImagesFiles);
            
            expect(generatedImages).toEqual({});
            expect(imageServiceSpy.createImage).toHaveBeenCalledWith(mockTaskId, mockGeneratedImagesFiles[0].path, 'test')
            expect(taskModelSpy.findByIdAndUpdate).toHaveBeenCalledTimes(1);
            expect(taskModelSpy.findByIdAndUpdate).toHaveBeenCalledWith(mockTaskId, { status: TaskStatus.SUCCESS});
        })
        test('should throw database creation error if create image fails and set task status to error', async () => {
            const connectionDatabaseError = new Error('Error connecting to database');
            const uploadGeneratedImagesError = new Error('Error creating image in database', { error: connectionDatabaseError.message });
            imageServiceSpy.createImage.mockRejectedValue(connectionDatabaseError)
            taskModelSpy.findByIdAndUpdate.mockResolvedValue({});
            
            await expect(domain.generatedImages(mockTaskId, mockGeneratedImagesFiles)).rejects.toThrow(uploadGeneratedImagesError);
            expect(imageServiceSpy.createImage).toHaveBeenCalledWith(mockTaskId, mockGeneratedImagesFiles[0].path, 'test')
            expect(taskModelSpy.findByIdAndUpdate).toHaveBeenCalledTimes(1);
            expect(taskModelSpy.findByIdAndUpdate).toHaveBeenCalledWith(mockTaskId, { status: TaskStatus.ERROR});
        })
        test('should throw updating task status to success error if fails', async () => {
            const connectionDatabaseError = new Error('Error connecting to database');
            const updateTaskStatusError = new Error('Error updating task status to success', { error: connectionDatabaseError.message });
            imageServiceSpy.createImage.mockResolvedValue({});
            taskModelSpy.findByIdAndUpdate.mockRejectedValue(connectionDatabaseError);
            
            await expect(domain.generatedImages(mockTaskId, mockGeneratedImagesFiles)).rejects.toThrow(updateTaskStatusError);
            expect(imageServiceSpy.createImage).toHaveBeenCalledWith(mockTaskId, mockGeneratedImagesFiles[0].path, 'test')
            expect(taskModelSpy.findByIdAndUpdate).toHaveBeenCalledTimes(1);
            expect(taskModelSpy.findByIdAndUpdate).toHaveBeenCalledWith(mockTaskId, { status: TaskStatus.SUCCESS });
        })
        test('should throw updating task status to error error if fails', async () => {
            const uploadGeneratedImagesError = new Error('Error creating image in database');
            const connectionDatabaseError = new Error('Error connecting to database');
            const updateTaskStatusError = new Error('Error updating task status to error', { error: connectionDatabaseError.message });
            imageServiceSpy.createImage.mockRejectedValue(uploadGeneratedImagesError);
            taskModelSpy.findByIdAndUpdate.mockRejectedValue(connectionDatabaseError);
            
            await expect(domain.generatedImages(mockTaskId, mockGeneratedImagesFiles)).rejects.toThrow(updateTaskStatusError);
            
            expect(imageServiceSpy.createImage).toHaveBeenCalledWith(mockTaskId, mockGeneratedImagesFiles[0].path, 'test')
            expect(taskModelSpy.findByIdAndUpdate).toHaveBeenCalledTimes(1);
            expect(taskModelSpy.findByIdAndUpdate).toHaveBeenCalledWith(mockTaskId, { status: TaskStatus.ERROR });
        })
    })
})