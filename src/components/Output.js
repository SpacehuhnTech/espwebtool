import React from 'react'
import PropTypes from 'prop-types'

import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import { setCookie, getCookie } from '../modules/cookie.js'

const preCSS = {
    position: 'relative',
    padding: '0',
    margin: '0',
    width: 'calc(100vw - 1rem)',
    maxWidth: '40rem',
}

const boxCSS = {
    width: '100%',
    height: '10rem',
    //minHeight: '5rem',
    //maxHeight: '10rem',

    background: '#eee',
    borderRadius: '4px',
    padding: 0,
    margin: 0,
    display: 'flex',
    overflowX: 'scroll',
    overflowY: 'scroll',
    flexDirection: 'column-reverse',
    resize: 'vertical',
    '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'transparent',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#555',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-corner': {
        background: 'transparent',
        borderRadius: '4px',
    },
    '&::-webkit-resizer': {
        display: 'none',
    },
}

const codeCSS = {
    margin: '.5rem',
    padding: 0,
    fontFamily: [
        'Roboto Mono',
        'monospace',
    ].join(','),
    fontWeight: 300,
}

const loadOpen = () => {
    const cookieValue = getCookie('output')
    return cookieValue ? cookieValue === 'true' : false
}

const Output = (props) => {
    // Currently receieved string & list of previous receieved lines
    const received = React.useRef('')
    const [lines, setLines] = React.useState([])

    const [visible, setVisible] = React.useState(loadOpen())

    const openOutput = (value) => {
        setVisible(value)
        setCookie('output', value)
    }

    React.useEffect(
        () => {
            const str = `${received.current}${props.received.value}`
            const lines = str.split('\n')

            let newReceived = str
            const newLines = []

            if (lines.length > 1) {
                newReceived = lines.pop()

                lines.forEach(line => {
                    newLines.push(`${line}`)
                })
            }
            setLines((current) => current.concat(newLines))
            received.current = newReceived
        },
        [props.received],
    )

    return (
        <>

            <pre style={preCSS}>
                <FormControlLabel control={<Checkbox checked={visible} onChange={e => openOutput(e.target.checked)} />} label="Show Output" />
                {visible &&
                    <Box sx={boxCSS}>
                        <code style={codeCSS}>
                            {lines.map((line, i) => (
                                <span key={i}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </code>
                    </Box>
                }
            </pre>
        </>
    )
}

Output.propTypes = {
    received: PropTypes.object,
}

export default Output