import React, { useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { Container } from '../components/materialUIContainers'
import Release from '../components/Release'

type TabPanelProps = {
  value: number
  index: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

interface Props {
  releases: any
}

const ResultsPageContent = ({ releases }: Props) => {
  const [selectedRelease, setSelectedRelease] = useState(0)

  const handleChange = (_event: React.ChangeEvent<{}>, value: number) => {
    setSelectedRelease(value)
  }

  return (
    <>
      <Box bgcolor="primary.main" color="info.contrastText">
        <Tabs value={selectedRelease} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Release 3 (June 2020)" {...a11yProps(0)} />
          <Tab label="Release 2 (May 2020)" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Container marginTop={2} fixed={true}>
        <TabPanel value={selectedRelease} index={0}>
          <Release {...releases[0]} />
        </TabPanel>
        <TabPanel value={selectedRelease} index={1}>
          <Release {...releases[1]} />
        </TabPanel>
      </Container>
    </>
  )
}

export default ResultsPageContent
