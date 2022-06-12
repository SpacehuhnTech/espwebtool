import React from 'react'
import PropTypes from 'prop-types'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const ConfirmWindow = (props) => {
    return (
        <Dialog open={props.open} onClose={props.onCancel}>
            <DialogTitle>Are you sure?</DialogTitle>

            <DialogContent>
                <DialogContentText>{props.text}</DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={props.onCancel} color='secondary'>Cancel</Button>
                <Button onClick={props.onOk} color='primary'>Continue</Button>
            </DialogActions>
        </Dialog>
    )
}

ConfirmWindow.propTypes = {
    open: PropTypes.bool,
    text: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func
}

export default ConfirmWindow