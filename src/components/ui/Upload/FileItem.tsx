import { VscFilePdf, VscFileZip, VscFile } from 'react-icons/vsc'
import classNames from '../utils/classNames'
import type { CommonProps } from '../@types/common'

const formatBytes = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return '0 B'
    }

    const units = ['B', 'KB', 'MB', 'GB']
    let value = bytes
    let unitIndex = 0

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024
        unitIndex += 1
    }

    const precision = value >= 10 || unitIndex === 0 ? 0 : 1
    return `${value.toFixed(precision)} ${units[unitIndex]}`
}

const FileIcon = ({ children }: CommonProps) => {
    return <span className="text-3xl heading-text">{children}</span>
}

export interface FileItemProps extends CommonProps {
    file: File
}

const FileItem = (props: FileItemProps) => {
    const { file, children, className } = props
    const { type, name, size } = file

    const renderThumbnail = () => {
        const isImageFile = type.split('/')[0] === 'image'

        if (isImageFile) {
            return (
                <img
                    className="upload-file-image"
                    src={URL.createObjectURL(file)}
                    alt={`file preview ${name}`}
                />
            )
        }

        if (type === 'application/zip') {
            return (
                <FileIcon>
                    <VscFileZip />
                </FileIcon>
            )
        }

        if (type === 'pdf') {
            return (
                <FileIcon>
                    <VscFilePdf />
                </FileIcon>
            )
        }

        return (
            <FileIcon>
                <VscFile />
            </FileIcon>
        )
    }

    return (
        <div className={classNames('upload-file', className)}>
            <div className="flex items-center">
                <div className="upload-file-thumbnail">{renderThumbnail()}</div>
                <div className="upload-file-info">
                    <h6 className="upload-file-name text-sm font-bold">
                        {name}
                    </h6>
                    <span className="upload-file-size">{formatBytes(size)}</span>
                </div>
            </div>
            {children}
        </div>
    )
}

FileItem.displayName = 'UploadFileItem'

export default FileItem
