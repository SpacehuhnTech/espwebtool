import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'

import FileUpload from './FileUpload'

const emptyUpload = {
    offset: 0,
    contents: [],
    fileName: '',
}

const FileUploads = () => {
    const [uploads, setUploads] = React.useState([])

    const uploadFile = (e) => {
        let reader = new FileReader()

        reader.onload = function () {
            const arrayBuffer = this.result
            const array = new Uint8Array(arrayBuffer)
            //const binaryString = String.fromCharCode.apply(null, array)

            setUploads([...uploads, {
                ...emptyUpload,
                contents: array,
                fileName: e.target.files[0].name,
            }])

            console.log({
                ...emptyUpload,
                contents: array,
                fileName: e.target.files[0].name,
            })
        }

        reader.readAsArrayBuffer(e.target.files[0])
    }

    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' spacing={.5} sx={{minHeight: '200px'}}>
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
                <Button
                    component='label'
                    color='primary'
                    sx={{
                        height: 40,
                        paddingLeft: '1em',
                        paddingRight: '1em',
                        width: 200,
                        wordBreak: 'break-all',
                        lineHeight: '1.25em',
                    }}
                >
                    Add File <DriveFolderUploadIcon style={{ paddingLeft: '.2em' }} />

                    <input
                        type='file'
                        hidden
                        onChange={uploadFile}
                    />
                </Button>
            </Grid>

        </Grid>
    )
}

export default FileUploads