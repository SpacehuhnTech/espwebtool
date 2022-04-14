import React from 'react'
import PropTypes from 'prop-types'

import Box from '@mui/material/Box'

const preCSS = {
    position: 'relative',
    padding: '0',
    margin: '0',
}

const boxCSS = {
    width: 'calc(100vw - 1rem)',
    maxWidth: '40rem',

    //height: '10rem',
    //minHeight: '5rem',
    maxHeight: '50rem',

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

const Output = (props) => {
    // Currently receieved string & list of previous receieved lines
    const received = React.useRef('')
    const [lines, setLines] = React.useState([])

    React.useEffect(
        () => {
            const str = `${received.current}${props.received}`
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
        <pre style={preCSS}>

            { /* Text */}
            {lines.length > 0 &&
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
    )
}

Output.propTypes = {
    received: PropTypes.string,
}

export default Output