import React from 'react'

import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import { Typography } from '@mui/material'

const FileEntry = (props) => {
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
                <Typography
                    sx={{
                        lineHeight: '40px',
                        textAlign: 'center',
                        width: '18em',
                    }}>
                    {props.data.fileName.substring(0, 32)}
                </Typography>
            </Grid>

            <Grid item>
                <Button onClick={props.delete} color='error'>
                    <DeleteIcon />
                </Button>
            </Grid>
        </Grid>
    )
}

export default FileEntry