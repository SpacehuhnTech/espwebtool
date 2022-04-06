import React from 'react'

import Grid from '@mui/material/Grid'
import FileUpload from './FileUpload.js'

const FileUploads = () => {
    return (
        <Grid container direction='column' justifyContent='flex-start' alignItems='center' spacing={.5}>
            <Grid item>
                <FileUpload />
            </Grid>

            <Grid item>
                <FileUpload />
            </Grid>

            <Grid item>
                <FileUpload />
            </Grid>

            <Grid item>
                <FileUpload />
            </Grid>
        </Grid>
    )
}

export default FileUploads