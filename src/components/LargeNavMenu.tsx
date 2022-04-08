import React, { useCallback, useMemo, useContext } from 'react'
import { Typography, makeStyles, Theme, SvgIconProps, Link } from '@material-ui/core'
import { TreeItem, TreeView } from '@material-ui/lab'
import { Link as GatsbyLink } from 'gatsby'
import {
  ExpandMore,
  ChevronRight,
  Info,
  Announcement,
  Book,
  Notes,
  Share,
  BarChart,
  CloudDownload,
  Computer,
  People,
  Explore,
} from '@material-ui/icons'
//@ts-expect-error
import { Context } from './PageWrapperContext'

interface NavLeaf {
  href: string
  label: string
  newTab?: boolean
}

interface NavBranch {
  label: string
  icon: React.ElementType<SvgIconProps>
  children: NavItem[]
}

type NavItem = NavLeaf | NavBranch

const navItems: NavItem[] = [
  {
    label: 'About',
    icon: Info,
    children: [
      { href: '/about/', label: 'Summary' },
      // {href: "/collaboration/", label: "Principles of collaboration"},
      // {href: "/analytical-approach/", label: "Analytical approach"},
      // {href: "/terms-of-use/", label: "Terms of use"},
      // {href: "/sequencing-support/", label: "Sequencing support"},
      { href: '/partners/', label: 'Study partners' },
      { href: '/projects/', label: 'Projects' },
      { href: '/contact/', label: 'Contact' },
    ],
  },
  {
    label: 'News',
    icon: Announcement,
    children: [
      {
        label: 'Blog',
        icon: Book,
        children: [
          {
            href: `/blog/2021-12-15-exploring-the-puzzle-of-hla-immunogenetics-in-covid-19-patients/`,
            label: `HLA Immunogenetics`,
          },
          {
            href: `/blog/2021-07-30-data-freeze-6-summary/`,
            label: `Scientific Summary (R6)`,
          },
          {
            href: `/blog/2021-07-07-multi-perspective-genomics-research-scientists-use-covid-19-host-genetics-initiative-genomic-data-to-solve-covid-19-conundrum/`,
            label: `Literature Review Pt. II`,
          },
          {
            href: `/blog/faq/`,
            label: `HGI FAQ`,
          },
          {
            href: `/blog/2021-04-15-wgswesupdate/`,
            label: `WGS / WES Group Update Summary`,
          },
          {
            href: `/blog/2021-03-02-freeze-5-results/`,
            label: `Scientific Summary (R5)`,
          },
          {
            href: '/blog/2021-02-19-layperson-lit-review/',
            label: 'Literature Review',
          },
          {
            href: '/blog/2021-02-05-mr-working-group/',
            label: 'Mendelian Randomization',
          },
          {
            href: '/blog/2020-11-24-covid-19-hgi-results-for-data-freeze-4-october-2020/',
            label: 'Scientific Summary (R4)',
          },
          { href: '/blog/2020-10-28-twas-working-group/', label: 'Disentangling COVID-19 Severity' },
          { href: '/blog/2020-09-24-freeze-3-results/', label: 'Scientific Summary (R3)' },
        ],
      },
      {
        label: 'Meeting Archive',
        icon: Notes,
        children: [
          { href: '/blog/2022-02-07-february-1-2022-meeting/', label: 'February 1, 2022' },
          { href: '/blog/2021-09-27-september-20-2021-meeting/', label: 'September 20, 2021' },
          { href: '/blog/2021-06-17-june-14-2021-meeting/', label: 'June 14, 2021' },
          { href: '/blog/2021-04-15-april-9-2021/', label: 'April 9, 2021' },
          { href: '/blog/2021-03-02-february-26-2021-meeting/', label: 'February 26, 2021' },
          { href: '/blog/2021-01-29-january-25-2021-meeting/', label: 'January 25, 2021' },
          { href: '/blog/2020-11-24-november-19-2020-meeting/', label: 'November 19, 2020' },
          { href: '/blog/2020-10-28-october-23-2020-meeting/', label: 'October 23, 2020' },
          { href: '/blog/2020-10-05-october-2-2020-meeting/', label: 'October 2, 2020' },
          { href: '/blog/2020-08-28-august-27-2020-meeting/', label: 'August 27, 2020' },
          { href: '/blog/2020-07-02-july-2-2020-meeting/', label: 'July 2, 2020' },
          { href: '/blog/2020-06-02-may-29-2020-meeting/', label: 'May 29, 2020' },
          { href: '/blog/2020-05-06-meeting-1-archive/', label: 'April 27, 2020' },
        ],
      },
    ],
  },
  {
    label: 'Data Sharing',
    icon: Share,
    children: [
      { href: '/data-sharing/', label: 'How to Share Data' },
      { href: '/register/', label: 'Register' },
    ],
  },
  {
    label: 'Results',
    icon: BarChart,
    children: [
      // { href: '/terms-of-use/', label: 'Terms of Use' },
      {
        label: 'Downloads',
        icon: CloudDownload,
        children: [
          { href: '/results/r7/', label: 'Release 7' },
          { href: '/results/r6/', label: 'Release 6' },
          { href: '/results/r5/', label: 'Release 5' },
          { href: '/results/r4/', label: 'Release 4' },
          { href: '/results/r3/', label: 'Release 3' },
          { href: '/results/r2/', label: 'Release 2' },
        ],
      },
      {
        label: 'Data Browser',
        icon: Explore,
        children: [
          { label: 'Genome-wide results', href: 'https://app.covid19hg.org', newTab: true },
          { label: 'Top associations', href: 'https://app.covid19hg.org/variants', newTab: true },
          { label: 'Results by region', href: 'https://app.covid19hg.org/region', newTab: true },
        ],
      },
      {
        label: 'In silico follow up',
        icon: Computer,
        children: [
          { href: '/blog/2020-10-22-in-silico-follow-up-results-for-freeze-v4/', label: 'Release 4' },
          { href: '/blog/2020-09-24-freeze-3-results/', label: 'Release 3' },
          { href: '/blog/2020-06-29-in-silico-follow-up-results/', label: 'Release 2' },
        ],
      },
    ],
  },
  {
    label: 'Acknowledgements',
    icon: People,
    children: [
      { href: '/acknowledgements/', label: 'Project contributors' },
      { href: '/publications/', label: 'Publications' },
    ],
  },
]

const useStyles = makeStyles((theme: Theme) => ({
  treeItemLabelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
    color: theme.palette.primary.main,
  },
  treeItemLabelIcon: {
    marginRight: theme.spacing(1),
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}))

export const LargeNavMenu = () => {
  const {
    data: { largeNavMenuExpandedNodeIds, largeNavMenuSelectedNodeIds },
    set,
  } = useContext(Context)
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleToggle = (_: React.ChangeEvent<{}>, nodeIds: string[]) => {
    set({ largeNavMenuExpandedNodeIds: nodeIds })
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleSelect = (_: React.ChangeEvent<{}>, nodeIds: string[]) => {
    set({ largeNavMenuSelectedNodeIds: nodeIds })
  }

  const classes = useStyles()
  const renderNavItem = useCallback((item: NavItem, index: number) => {
    const children = 'children' in item ? item.children.map(renderNavItem) : null
    let labelContent: React.ReactNode
    if ('children' in item) {
      const IconLabel = item.icon
      labelContent = (
        <div className={classes.treeItemLabelRoot}>
          <IconLabel color="inherit" className={classes.treeItemLabelIcon} />
          <Typography>{item.label}</Typography>
        </div>
      )
    } else {
      const linkElem = item.href.startsWith('/') ? (
        <GatsbyLink to={item.href} className={classes.link}>
          {' '}
          {item.label}{' '}
        </GatsbyLink>
      ) : (
        //@ts-expect-error
        <Link href={item.href} className={classes.link} target={item.newTab && '_blank'} rel="noopener">
          {item.label}
        </Link>
      )
      labelContent = <div className={classes.treeItemLabelRoot}>{linkElem}</div>
    }
    const label = <div className={classes.treeItemLabelRoot}>{labelContent}</div>

    return (
      <TreeItem label={label} nodeId={item.label} key={index}>
        {children}
      </TreeItem>
    )
  }, [])
  const newDrawerItems = useMemo(() => navItems.map(renderNavItem), [])

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      expanded={largeNavMenuExpandedNodeIds}
      selected={largeNavMenuSelectedNodeIds}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
    >
      {newDrawerItems}
    </TreeView>
  )
}
