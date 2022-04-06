import React from 'react'

import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'

const FileUpload = () => {
    const [name, setName] = React.useState('Select File')
    const [content, setContent] = React.useState([])

    const uploadFile = (e) => {
        let reader = new FileReader()

        reader.onload = function () {
            const arrayBuffer = this.result
            const array = new Uint8Array(arrayBuffer)
            //const binaryString = String.fromCharCode.apply(null, array)

            setContent(array)
        }

        reader.readAsArrayBuffer(e.target.files[0])
        setName(e.target.files[0].name)
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
                />
            </Grid>

            <Grid item>
                <Button
                    component='label'
                    color={content.length > 0 ? 'secondary' : 'primary'}
                    sx={{
                        height: 40,
                        paddingLeft: '1em',
                        paddingRight: '1em',
                        width: 200,
                        wordBreak: 'break-all',
                        lineHeight: '1.25em',
                    }}
                >
                    {name.substring(0, 32)}

                    {content.length === 0 &&
                        <DriveFolderUploadIcon style={{ paddingLeft: '.2em' }} />
                    }

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

export default FileUpload