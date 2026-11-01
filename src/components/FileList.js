import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import AddBoxIcon from '@mui/icons-material/AddBox'
import DeleteIcon from '@mui/icons-material/Delete'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import styles from './FileList.module.css'

import ConfirmWindow from './ConfirmWindow'

import { mergedFile, multipleFiles, saveFiles } from '../lib/esp'

const hasFile = (file) => Boolean(file.fileName && file.obj)

const FileList = (props) => {
    // A single file at 0x0 means a merged image, anything else is the multi-file layout
    const layout = props.uploads.length === 1 && parseInt(props.uploads[0].offset, 16) === 0 ? 'single' : 'multiple'

    const [pendingLayout, setPendingLayout] = React.useState(null)

    const addFile = () => {
        props.setUploads([...props.uploads, {
            offset: 0
        }])
    }

    const applyLayout = (newLayout) => {
        const newUploads = newLayout === 'single' ? mergedFile() : multipleFiles(props.chipName)

        saveFiles(newUploads)
        props.setUploads(newUploads)
    }

    const changeLayout = (newLayout) => {
        if (!newLayout || newLayout === layout) return

        // Switching layouts rebuilds the list, so don't silently drop selected files
        if (props.uploads.some(hasFile)) {
            setPendingLayout(newLayout)
        } else {
            applyLayout(newLayout)
        }
    }

    const reset = () => {
        applyLayout('single')
    }

    const uploadFile = (e, i) => {
        const newUploads = [...props.uploads]

        newUploads[i] = {
            ...newUploads[i],
            fileName: e.target.files[0].name,
            obj: e.target.files[0],
        }

        saveFiles(newUploads)
        props.setUploads(newUploads)
    }

    const setOffset = (index, newOffset) => {
        const newUploads = [...props.uploads]
        newUploads[index] = {
            ...props.uploads[index],
            offset: newOffset
        }

        saveFiles(newUploads)
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

        saveFiles(newUploads)
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

            {/* Reset, layout switch & Add File */}
            <Grid container spacing={.5} alignItems='center'>
                <Grid item xs={4} sx={{ textAlign: 'left' }}>
                    <Button color='error' component='label' size='large' onClick={reset} endIcon={<RestartAltIcon />}>
                        Reset
                    </Button>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <Tooltip title='Off: one merged .bin at 0x0. On: separate bootloader, partition table and app files.'>
                        <FormControlLabel
                            sx={{ m: 0 }}
                            control={
                                <Switch
                                    size='small'
                                    checked={layout === 'multiple'}
                                    onChange={(e) => changeLayout(e.target.checked ? 'multiple' : 'single')}
                                />
                            }
                            label={<Typography variant='caption'>Multiple files</Typography>}
                        />
                    </Tooltip>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                    <Button color='primary' component='label' size='large' onClick={addFile} endIcon={<AddBoxIcon />}>
                        Add
                    </Button>
                </Grid>
            </Grid>

            {/* Confirm layout change, since it drops the selected files */}
            <ConfirmWindow
                open={pendingLayout !== null}
                text={'Switching the layout will remove your selected files.'}
                onOk={() => {
                    applyLayout(pendingLayout)
                    setPendingLayout(null)
                }}
                onCancel={() => setPendingLayout(null)}
            />
        </Box>
    )
}

FileList.propTypes = {
    uploads: PropTypes.array,
    setUploads: PropTypes.func,
    chipName: PropTypes.string,
}

export default FileList