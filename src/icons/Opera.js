import React from 'react'
import SvgIcon from '@mui/material/SvgIcon'

export default function OperaIcon(props) {
  return (
    <SvgIcon {...props} viewBox='0 0 76 76'>
      <linearGradient id="a" gradientTransform="matrix(0 -54.944 -54.944 0 24 79)" gradientUnits="userSpaceOnUse" x2="1">
        <stop offset="0" stopColor="#ff1b2d" />
        <stop offset=".3" stopColor="#ff1b2d" />
        <stop offset=".6" stopColor="#ff1b2d" />
        <stop offset="1" stopColor="#a70014" />
      </linearGradient>
      <linearGradient id="b" gradientTransform="matrix(0 -48.595 -48.595 0 38 76)" gradientUnits="userSpaceOnUse" x2="1">
        <stop offset="0" stopColor="#9c0000" />
        <stop offset=".7" stopColor="#ff4b4b" />
        <stop offset="1" stopColor="#ff4b4b" />
      </linearGradient>
      <path d="M28 80a28 28 0 1 1 19-49c-3-2-7-4-11-4-7 0-13 4-17 9-3 4-5 9-5 15v2c0 6 2 11 5 15 4 5 10 9 17 9 4 0 8-2 11-4-5 5-11 7-19 7z" fill="url(#a)" transform="matrix(1.3333 0 0 -1.3333 0 107)" />
      <path d="M19 68c3 3 6 5 10 5 8 0 15-9 15-21s-7-21-15-21c-4 0-7 2-10 5 4-5 10-9 17-9 4 0 8 2 11 4a28 28 0 0 1 0 42c-3 2-7 4-11 4-7 0-13-4-17-9" fill="url(#b)" transform="matrix(1.3333 0 0 -1.3333 0 107)" />
    </SvgIcon>
  )
}