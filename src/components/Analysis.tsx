import React from 'react'
import { Card, CardContent, Typography, makeStyles, Theme, Link, Divider } from '@material-ui/core'
import { Grid } from './materialUIContainers'
import _sumBy from 'lodash/sumBy'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { withStyles, createStyles } from '@material-ui/styles'

export type AnalysisProps = {
  name: string
  phenotype: string
  population: string
  downloads: {
    name: string
    description: string
    url: string
  }[]
  manhattan: any
  qqplot: any
  studies: {
    cases: number
    controls: number
    study: string
  }[]
}

export const AlternatelyShadedTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow)

const leftColumnWidthXs = 12
const rightColumnWidthXs = 12
const leftColumnWidthMd = 3
const rightColumnWidthMd = 9

const useStyles = makeStyles(() => ({
  plot: {
    width: '100%',
  },
  wideTable: {
    overflowX: 'auto',
  },
}))

const Analysis = ({ analysis }: { analysis: AnalysisProps }) => {
  const classes = useStyles()
  const studyTableRows = analysis.studies.map(({ study, cases, controls }: any) => (
    <AlternatelyShadedTableRow key={study}>
      <TableCell>{study}</TableCell>
      <TableCell align="right">{cases}</TableCell>
      <TableCell align="right">{controls}</TableCell>
    </AlternatelyShadedTableRow>
  ))
  const studyTable = (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell component="th" scope="row">
            Name
          </TableCell>
          <TableCell align="right">n_cases</TableCell>
          <TableCell align="right">n_controls</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{studyTableRows}</TableBody>
    </Table>
  )
  return (
    <Grid item={true} xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom={true}>
            {analysis.name}
          </Typography>
          <Divider />

          <Grid container={true} marginTop={2} spacing={1}>
            {analysis.manhattan && (
              <Grid item={true} xs={12} md={8}>
                <img src={analysis.manhattan.image.publicURL} className={classes.plot} />
              </Grid>
            )}
            {analysis.qqplot && (
              <Grid item={true} xs={12} md={4}>
                <img src={analysis.qqplot.image.publicURL} className={classes.plot} />
              </Grid>
            )}
          </Grid>

          <Grid container={true} alignItems={'center' as const} spacing={1}>
            <Grid item={true} xs={leftColumnWidthXs} md={leftColumnWidthMd}>
              <Typography variant="h6">Phenotype</Typography>
            </Grid>
            <Grid item={true} xs={rightColumnWidthXs} md={rightColumnWidthMd}>
              <Typography>{analysis.phenotype}</Typography>
            </Grid>

            <Grid item={true} xs={leftColumnWidthXs} md={leftColumnWidthMd}>
              <Typography variant="h6">Population</Typography>
            </Grid>
            <Grid item={true} xs={rightColumnWidthXs} md={rightColumnWidthMd}>
              <Typography>{analysis.population}</Typography>
            </Grid>

            <Grid item={true} xs={leftColumnWidthXs} md={leftColumnWidthMd}>
              <Typography variant="h6">Total Cases</Typography>
            </Grid>
            <Grid item={true} xs={rightColumnWidthXs} md={rightColumnWidthMd}>
              <Typography>{_sumBy(analysis.studies, 'cases')}</Typography>
            </Grid>

            <Grid item={true} xs={leftColumnWidthXs} md={leftColumnWidthMd}>
              <Typography variant="h6">Total Controls</Typography>
            </Grid>
            <Grid item={true} xs={rightColumnWidthXs} md={rightColumnWidthMd}>
              <Typography>{_sumBy(analysis.studies, 'controls')}</Typography>
            </Grid>

            <Grid item={true} xs={leftColumnWidthXs} md={leftColumnWidthMd}>
              <Typography variant="h6">Contributing Studies</Typography>
            </Grid>
            <Grid item={true} xs={rightColumnWidthXs} md={rightColumnWidthMd} className={classes.wideTable}>
              {studyTable}
            </Grid>

            <Grid item={true} xs={leftColumnWidthXs} md={leftColumnWidthMd}>
              <Typography variant="h6">Downloads</Typography>
            </Grid>
            <Grid item={true} xs={rightColumnWidthXs} md={rightColumnWidthMd}>
              {analysis.downloads.map((download) => (
                <Typography key={download.name}>
                  <strong>
                    {download.description}
                    {': '}
                  </strong>
                  <Link href={download.url} target="_blank" rel="noopener noreferrer">
                    {download.name}{' '}
                  </Link>
                </Typography>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default Analysis
