import {
    extractFMUModelFromPath,
    getFMUModelFromPath,
    modelCache,
    parseXMLModelDescription,
} from 'fmu'
import JSZip from 'jszip'
import * as vscode from 'vscode'
import { Uri } from 'vscode'
import {
    dummyModelMinimal,
    dummyModelDescriptionMinimal,
} from './data/dummy-data'

jest.mock('jszip')

const readFileMock = jest.mocked(vscode.workspace.fs.readFile)
const statMock = jest.mocked(vscode.workspace.fs.stat)

const workspaceUri = vscode.Uri.file('/data')
const workspaceFolder: vscode.WorkspaceFolder = {
    uri: workspaceUri,
    name: 'data',
    index: 0,
}

function getDummyFileStatFromCtime(ctime: number): vscode.FileStat {
    return {
        ctime: ctime,
        size: 0,
        type: vscode.FileType.Unknown,
        mtime: ctime,
    }
}

describe('FMU Parsing', () => {
    afterEach(() => {
        jest.clearAllMocks()
        modelCache.clear()
    })

    it('parses XML model description correctly', async () => {
        const result = parseXMLModelDescription(dummyModelDescriptionMinimal)

        expect(result).toEqual(dummyModelMinimal)
    })

    it('throws when parsing invalid XML model description', async () => {
        expect(() => parseXMLModelDescription('<invalid_xml')).toThrow()
    })

    describe('extractFMUModelFromPath', () => {
        it('throws when modelDescription.xml does not exist', async () => {
            readFileMock.mockResolvedValue(Buffer.from('file content'))
            ;(JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: () => null,
            })

            await expect(
                extractFMUModelFromPath(Uri.file('file/path'))
            ).rejects.toThrow()
        })

        it('throws when fmu file does not exist', async () => {
            readFileMock.mockRejectedValue(false)

            await expect(
                extractFMUModelFromPath(Uri.file('file/path'))
            ).rejects.toThrow()
        })

        it('extracts the model from the zip correctly', async () => {
            readFileMock.mockResolvedValue(Buffer.from('zip content'))
            ;(JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: jest.fn().mockImplementation((fileName) => {
                    if (fileName === 'modelDescription.xml') {
                        return {
                            async: jest
                                .fn()
                                .mockResolvedValue(
                                    dummyModelDescriptionMinimal
                                ),
                        }
                    }

                    return null
                }),
            })

            const result = await extractFMUModelFromPath(Uri.file('file/path'))

            expect(result).toEqual(dummyModelMinimal)
        })
    })
    describe('getFMUModelFromPath', () => {
        it('throws when modelDescription.xml does not exist', async () => {
            readFileMock.mockResolvedValue(Buffer.from('file content'))
            ;(JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: jest.fn(() => null),
            })

            await expect(
                getFMUModelFromPath(workspaceFolder, 'file/path')
            ).rejects.toThrow()
        })

        it('throws when fmu file does not exist', async () => {
            readFileMock.mockRejectedValue(false)

            expect(
                getFMUModelFromPath(workspaceFolder, 'file/path')
            ).rejects.toThrow()
        })

        it('returns the model during cache miss', async () => {
            readFileMock.mockResolvedValue(Buffer.from('zip content'))
            ;(JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: jest.fn().mockImplementation((fileName) => {
                    if (fileName === 'modelDescription.xml') {
                        return {
                            async: jest
                                .fn()
                                .mockResolvedValue(
                                    dummyModelDescriptionMinimal
                                ),
                        }
                    }

                    return null
                }),
            })
            statMock.mockResolvedValue(getDummyFileStatFromCtime(0))

            const result = await getFMUModelFromPath(
                workspaceFolder,
                'file/path'
            )

            expect(result).toEqual(dummyModelMinimal)
            expect(vscode.workspace.fs.stat).toHaveBeenCalledWith(
                Uri.file('/data/file/path')
            )
            expect(vscode.workspace.fs.readFile).toHaveBeenCalledWith(
                Uri.file('/data/file/path')
            )
        })

        it("throws during cache miss if model can't be extracted from file", async () => {
            readFileMock.mockResolvedValue(Buffer.from('zip content'))
            ;(JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: jest.fn().mockImplementation(() => {
                    return null
                }),
            })
            statMock.mockResolvedValue(getDummyFileStatFromCtime(0))

            await expect(
                getFMUModelFromPath(workspaceFolder, 'file/path')
            ).rejects.toThrow()
        })

        it('returns the model during cache hit', async () => {
            readFileMock.mockResolvedValue(Buffer.from('zip content'))
            ;(JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: jest.fn().mockImplementation((fileName) => {
                    if (fileName === 'modelDescription.xml') {
                        return {
                            async: jest
                                .fn()
                                .mockResolvedValue(
                                    dummyModelDescriptionMinimal
                                ),
                        }
                    }

                    return null
                }),
            })
            statMock.mockResolvedValue(getDummyFileStatFromCtime(1))

            const result = await getFMUModelFromPath(
                workspaceFolder,
                'file/path'
            )

            expect(result).toEqual(dummyModelMinimal)

            const secondResult = await getFMUModelFromPath(
                workspaceFolder,
                'file/path'
            )

            expect(secondResult).toEqual(result)
        })

        it('returns the model during cache hit when the file has been modified', async () => {
            readFileMock.mockResolvedValue(Buffer.from('zip content'))
            ;(JSZip.loadAsync as jest.Mock).mockResolvedValue({
                file: jest.fn().mockImplementation((fileName) => {
                    if (fileName === 'modelDescription.xml') {
                        return {
                            async: jest
                                .fn()
                                .mockResolvedValue(
                                    dummyModelDescriptionMinimal
                                ),
                        }
                    }

                    return null
                }),
            })
            statMock.mockResolvedValue(getDummyFileStatFromCtime(0))

            const result = await getFMUModelFromPath(
                workspaceFolder,
                'file/path'
            )

            expect(result).toEqual(dummyModelMinimal)
            statMock.mockResolvedValue(getDummyFileStatFromCtime(1))

            const secondResult = await getFMUModelFromPath(
                workspaceFolder,
                'file/path'
            )

            expect(secondResult).not.toBe(result)
            expect(secondResult).toEqual(result)
        })
    })
})
