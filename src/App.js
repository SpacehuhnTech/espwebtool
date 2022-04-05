import Box from '@mui/material/Box'

import Header from './components/Header'
import Footer from './components/Footer'
import FileUploads from './components/FileUploads'
import Buttons from './components/Buttons'
import Output from './components/Output'

function App() {
  return (
    <Box>
      <Header />

      <FileUploads/>
      <Buttons/>

      <Output />
      
      <Footer />
    </Box>
  )
}

export default App