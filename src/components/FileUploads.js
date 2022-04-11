import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import FileUpload from './FileUpload'

const emptyUpload = {
    offset: 0,
    contents: [],
    fileName: '',
}

const FileUploads = () => {
    const [uploads, setUploads] = React.useState([
        { ...emptyUpload }
    ])

    const addUpload = () => {
        setUploads([...uploads, { ...emptyUpload }])
    }

    return (
        <Grid container direction='column' justifyContent='flex-start' alignItems='center' spacing={.5}>
            {uploads.map((upload, i) =>
                <Grid item key={i}>
                    <FileUpload
                        data={upload}
                        setData={(newObject) => {
                            const newUploads = [...uploads]
                            newUploads[i] = newObject
                            setUploads(newUploads)
                        }}
                        delete={() => {
                            const newUploads = [...uploads]
                            newUploads.splice(i, 1)
                            setUploads(newUploads)
                        }}
                    />
                </Grid>
            )}

            <Grid item>
                <Button onClick={addUpload}>Add File</Button>
            </Grid>

        </Grid>
    )
}

export default FileUploads