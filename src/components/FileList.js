import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import DeleteIcon from '@mui/icons-material/Delete'

const FileList = (props) => {
    const uploadFile = (e) => {
        props.setUploads([...props.uploads, {
            offset: 0,
            fileName: e.target.files[0].name,
            obj: e.target.files[0],
        }])
    }

    const setOffset = (index, newOffset) => {
        const newUploads = [...props.uploads]
        newUploads[index] = {
            ...props.uploads[index],
            offset: newOffset
        }
        props.setUploads(newUploads)
    }

    const deleteFile = (index) => {
        const newUploads = [...props.uploads]
        newUploads.splice(index, 1)
        props.setUploads(newUploads)
    }

    const onlyHex = (e) => {
        const re = /[0-9a-fA-F]+/g
        if (!re.test(e.key)) e.preventDefault()
    }

    return (
        <Box textAlign='center'>
            { /* File List */}
            <Grid container spacing={.5}
                sx={{
                    width: 'calc(100vw - 3rem)',
                    maxWidth: '40rem',
                    mb: '1rem',
                }}>

                {/* Offset */}
                <Grid item xs={2}>
                    {props.uploads.map((file, i) =>
                        <TextField
                            key={i}
                            label='0x'
                            variant='outlined'
                            size='small'
                            value={file.offset}
                            onKeyDown={onlyHex}
                            onChange={(e) => setOffset(i, e.target.value)}
                        />)}
                </Grid>

                {/* File Name */}
                <Grid item xs={9}>
                    {props.uploads.map((file, i) =>
                        <Typography
                            key={i}
                            sx={{
                                lineHeight: '40px',
                                textAlign: 'center',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}>
                            {file.fileName}
                        </Typography>
                    )}
                </Grid>

                {/* Delete */}
                <Grid item xs={1}>
                    {props.uploads.map((file, i) =>
                        <IconButton
                            key={i}
                            color='error'
                            onClick={() => deleteFile(i)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    )}
                </Grid>
            </Grid>

            { /* Upload new File Button */}
            <Button variant='outlined' color='primary' component='label' size='large'>
                Add File <DriveFolderUploadIcon style={{ paddingLeft: '.2em' }} />
                <input
                    type='file'
                    hidden
                    onChange={uploadFile}
                />
            </Button>
        </Box>
    )
}

FileList.propTypes = {
    uploads: PropTypes.array,
    setUploads: PropTypes.func,
    chipName: PropTypes.string,
}

export default FileList