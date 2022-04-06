import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import Header from './components/Header'
import Footer from './components/Footer'
import FileUploads from './components/FileUploads'
import Buttons from './components/Buttons'
import Output from './components/Output'

function App() {
  return (
    <Box>
      <Header />

      <Grid container direction='column' alignItems='center' spacing={1} style={{ marginTop: '.5em', marginBottom:'1em' }}>
        <Grid item xs={12}>
          <FileUploads />
        </Grid>

        <Grid item xs={12}>
          <Buttons />
        </Grid>

        <Grid item xs={12}>
          <Output />
        </Grid>
      </Grid>

      <Footer />
    </Box>
  )
}

export default App