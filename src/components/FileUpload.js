import React from 'react'

import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import DeleteIcon from '@mui/icons-material/Delete'

const FileUpload = (props) => {
    const uploadFile = (e) => {
        let reader = new FileReader()

        reader.onload = function () {
            const arrayBuffer = this.result
            const array = new Uint8Array(arrayBuffer)
            //const binaryString = String.fromCharCode.apply(null, array)

            props.setData({
                ...props.data,
                contents: array
            })
        }

        reader.readAsArrayBuffer(e.target.files[0])
        props.setData({
            ...props.data,
            fileName: e.target.files[0].name
        })
    }

    return (
        <Grid container spacing={1}>
            <Grid item>
                <TextField
                    label='0x'
                    variant='outlined'
                    type='number'
                    size='small'
                    sx={{ width: '10em' }}
                    value={props.data.offset > 0 ? props.data.offset : ''}
                    onChange={(e) => {
                        props.setData({
                            ...props.data,
                            offset: e.target.value
                        })
                    }}
                />
            </Grid>

            <Grid item>
                <Button
                    component='label'
                    color={props.data.contents.length > 0 ? 'secondary' : 'primary'}
                    sx={{
                        height: 40,
                        paddingLeft: '1em',
                        paddingRight: '1em',
                        width: 200,
                        wordBreak: 'break-all',
                        lineHeight: '1.25em',
                    }}
                >
                    {props.data.fileName.substring(0, 32)}

                    {props.data.contents.length === 0 &&
                        <DriveFolderUploadIcon style={{ paddingLeft: '.2em' }} />
                    }

                    <input
                        type='file'
                        hidden
                        onChange={uploadFile}
                    />
                </Button>
            </Grid>

            <Grid item>
                <Button onClick={props.delete} color='error'>
                    <DeleteIcon />
                </Button>
            </Grid>
        </Grid>
    )
}

export default FileUpload