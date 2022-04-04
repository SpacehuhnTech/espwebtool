import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import GlobalStyles from '@mui/material/GlobalStyles'

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles styles={{ body: { margin: 0 } }} />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)