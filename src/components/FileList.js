import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import AddBoxIcon from '@mui/icons-material/AddBox'
import DeleteIcon from '@mui/icons-material/Delete'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import styles from './FileList.module.css'

import { loadFiles } from '../lib/esp'

const FileList = (props) => {
    const addFile = () => {
        props.setUploads([...props.uploads, {
            offset: 0
        }])
    }

    const reset = () => {
        props.setUploads(loadFiles(props.chipName))
    }

    const uploadFile = (e, i) => {
        const newUploads = [...props.uploads]

        newUploads[i] = {
            ...newUploads[i],
            fileName: e.target.files[0].name,
            obj: e.target.files[0],
        }

        props.setUploads(newUploads)
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
        const file = props.uploads[index]
        const newUploads = [...props.uploads]

        if (file.fileName) {
            newUploads[index] = {
                ...newUploads[index],
                fileName: undefined,
                obj: undefined,
            }
        } else {
            newUploads.splice(index, 1)
        }

        props.setUploads(newUploads)
    }

    const onlyHex = (e) => {
        const re = /[0-9a-fA-F]+/g
        if (!re.test(e.key)) e.preventDefault()
    }

    return (
        <Box textAlign='center' className={styles.box}>
            {props.uploads.map((file, i) =>
                <Grid container spacing={0} className={styles.fileItem} key={i}>
                    {/* Offset */}
                    <Grid item xs={2} className={styles.fileOffset}>
                        <TextField
                            label='0x'
                            variant='outlined'
                            size='small'
                            value={file.offset}
                            onKeyDown={onlyHex}
                            onChange={(e) => setOffset(i, e.target.value)}
                        />
                    </Grid>

                    {/* File Name */}
                    <Grid item xs={9}>
                        {file.fileName ?
                            <Typography className={styles.fileName}>
                                {file.fileName}
                            </Typography>
                            :
                            <Button variant='outlined' color='primary' component='label' endIcon={<DriveFolderUploadIcon />}>
                                Select
                                <input
                                    type='file'
                                    hidden
                                    onChange={(e) => uploadFile(e, i)}
                                />
                            </Button>
                        }
                    </Grid>

                    {/* Delete */}
                    <Grid item xs={1}>
                        <IconButton
                            color='error'
                            onClick={() => deleteFile(i)}
                        >
                            {file.fileName ?
                                <HighlightOffIcon />
                                :
                                <DeleteIcon />
                            }
                        </IconButton>
                    </Grid>
                </Grid>
            )}

            {/* Add File */}
            <Grid container spacing={.5}>
                <Grid item xs={6} sx={{ textAlign: 'left' }}>
                    <Button color='error' component='label' size='large' onClick={reset} endIcon={<RestartAltIcon />}>
                        Reset
                    </Button>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Button color='primary' component='label' size='large' onClick={addFile} endIcon={<AddBoxIcon />}>
                        Add
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}

FileList.propTypes = {
    uploads: PropTypes.array,
    setUploads: PropTypes.func,
    chipName: PropTypes.string,
}

export default FileList