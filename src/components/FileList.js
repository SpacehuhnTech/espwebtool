import React from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'

import FileEntry from './FileEntry'

const FileList = (props) => {
    const uploadFile = (e) => {
        let reader = new FileReader()

        reader.onload = function () {
            const arrayBuffer = this.result
            const array = new Uint8Array(arrayBuffer)
            //const binaryString = String.fromCharCode.apply(null, array)

            props.setUploads([...props.uploads, {
                offset: 0,
                contents: array,
                fileName: e.target.files[0].name,
            }])
        }

        reader.readAsArrayBuffer(e.target.files[0])
    }

    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' spacing={.5} sx={{minHeight: '200px'}}>
            {props.uploads.map((upload, i) =>
                <Grid item key={i}>
                    <FileEntry
                        data={upload}
                        setData={(newObject) => {
                            const newUploads = [...props.uploads]
                            newUploads[i] = newObject
                            props.setUploads(newUploads)
                        }}
                        delete={() => {
                            const newUploads = [...props.uploads]
                            newUploads.splice(i, 1)
                            props.setUploads(newUploads)
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

export default FileList