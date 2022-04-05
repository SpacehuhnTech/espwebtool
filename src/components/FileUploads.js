import React from 'react'

import Box from '@mui/material/Box'
import FileUpload from './FileUpload.js'

const FileUploads = () => {
    return (
        <Box>
            <FileUpload />
            <FileUpload />
            <FileUpload />
            <FileUpload />
        </Box>
    )
}

export default FileUploads