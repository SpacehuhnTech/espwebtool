import React from 'react'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { Typography } from '@mui/material';

const FileUpload = () => {
    return (
        <Box>
            <TextField label="0x" variant="outlined" type="number" />
            <Typography>somefile</Typography>
            <Button>Select File&nbsp;<DriveFolderUploadIcon /></Button>
        </Box>
    )
}

export default FileUpload