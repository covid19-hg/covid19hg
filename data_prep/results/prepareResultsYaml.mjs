import fs from 'fs'
import yaml from 'js-yaml'

const RESULTS_URL = 'https://storage.googleapis.com/covid19-hg-public/20210415/results/20210607'

const VERSION = '20210607'

const RESULTS_PREFIX = 'COVID19_HGI'

const B37_GZ_SUFFIX = '.b37.txt.gz'
const B37_TBI_SUFFIX = '.b37.txt.gz.tbi'
// const B37_FILTERED_SUFFIX = '.b37_1.0E-5.txt'

const B38_GZ_SUFFIX = '.txt.gz'
const B38_TBI_SUFFIX = '.txt.gz.tbi'
// const B38_FILTERED_SUFFIX = '.txt.gz_1.0E-5.txt'

// const B38_10K_GZ_SUFFIX = '.10k.txt.gz'
// const B38_10K_TBI_SUFFIX = '.10k.txt.gz.tbi'

// const B37_10K_GZ_SUFFIX = '.10k.b37.txt.gz'
// const B37_10K_TBI_SUFFIX = '.10k.txt.gz.tbi'

const downloadTypes = [
  { type: 'full_grch37_gz', description: 'GRCh37 liftover', suffix: B37_GZ_SUFFIX },
  { type: 'full_grch37_tbi', description: 'GRCh37 (.tbi)', suffix: B37_TBI_SUFFIX },
  // { type: 'grch37_filtered', description: 'GRCh37 (filtered)', suffix: B37_FILTERED_SUFFIX },

  { type: 'full_grch38_gz', description: 'GRCh38', suffix: B38_GZ_SUFFIX },
  { type: 'full_grch38_tbi', description: 'GRCh38 (.tbi)', suffix: B38_TBI_SUFFIX },
  // { type: 'grch38_filtered', description: 'GRCh38 (filtered)', suffix: B38_FILTERED_SUFFIX },
]

const PLOT_FOLDER = `/img/${VERSION}`
const MANHATTAN_SUFFIX = 'inv_var_meta_p_flag_all_inv_var_meta_p_manhattan.png'
const MANHATTAN_LOGLOG_SUFFIX = 'inv_var_meta_p_flag_all_inv_var_meta_p_manhattan_loglog.png'
const QQPLOT_SUFFIX = 'inv_var_meta_p_flag_all_inv_var_meta_p_qqplot.png'

let phenotypes = [
  {
    phenotypeId: 'A2_ALL',
    description: 'Very severe respiratory confirmed covid vs. population',
  },
  { phenotypeId: 'B1_ALL', description: 'Hospitalized covid vs. not hospitalized covid' },
  {
    phenotypeId: 'B2_ALL',
    description: 'Hospitalized covid vs. population',
  },
  { phenotypeId: 'C2_ALL', description: 'Covid vs. population' },
]

const subsets = [
  {
    subsetDownloadId: 'leave_23andme',
    subsetDisplayId: 'leave_23andme',
    plotDisplayId: '',
    population: 'All',
  },
]

let analyses = phenotypes.reduce((acc, { phenotypeId, description }) => {
  const analyses = subsets.map((subset) => ({
    analysisDownloadId: `${phenotypeId}_${subset.subsetDownloadId}`,
    phenotype: description,
    population: subset.population,
    analysisDisplayId: `${phenotypeId}_${subset.subsetDisplayId}`,
    plotDisplayId: `${phenotypeId}${subset.plotDisplayId}`,
  }))
  return [...acc, ...analyses]
}, [])

analyses = analyses.map((analysis) => ({
  ...analysis,
  meta: JSON.parse(fs.readFileSync(`./metadata/${analysis.analysisDisplayId}.json`)).meta,
}))

analyses = analyses.map((analysis) => ({
  ...analysis,
  studies: analysis.meta.map((s) => ({ study: s.name, cases: s.n_cases, controls: s.n_controls })),
}))

analyses = analyses.map((analysis) => {
  return {
    ...analysis,
    downloads: downloadTypes.map((downloadType) => {
      let version = downloadType.versionModifier ? `${downloadType.versionModifier}_${VERSION}` : VERSION
      const fileName = `${RESULTS_PREFIX}_${analysis.analysisDownloadId}_${version}${downloadType.suffix}`

      const url = analysis.dirPrefix
        ? `${RESULTS_URL}/${analysis.dirPrefix}/${fileName}`
        : `${RESULTS_URL}/${fileName}`

      return {
        name: fileName,
        description: downloadType.description,
        url,
      }
    }),
  }
})

analyses = analyses.map((analysis) => {
  if (!analysis.noPlots) {
    return {
      ...analysis,
      manhattan: { image: `${PLOT_FOLDER}/${analysis.plotDisplayId}_${MANHATTAN_SUFFIX}` },
      manhattan_loglog: { image: `${PLOT_FOLDER}/${analysis.plotDisplayId}_${MANHATTAN_LOGLOG_SUFFIX}` },
      qqplot: { image: `${PLOT_FOLDER}/${analysis.plotDisplayId}_${QQPLOT_SUFFIX}` },
    }
  } else {
    return analysis
  }
})

analyses = analyses.map((analysis) => {
  const {
    analysisDisplayId,
    population,
    phenotype,
    downloads,
    manhattan,
    manhattan_loglog,
    qqplot,
    studies,
  } = analysis
  return {
    name: analysisDisplayId,
    population,
    phenotype,
    downloads,
    manhattan,
    manhattan_loglog,
    qqplot,
    studies,
  }
})

const release = {
  date: 'June 15, 2021',
  notes:
    'Meta-analysis was done with fixed effects inverse variance weighting. Results are available in genome builds 38 and 37. An AF filter of 0.001 and an INFO filter of 0.6 was applied to each study before meta.',
  data_columns: [
    {
      column: '#CHR',
      description: 'chromosome',
    },
    {
      column: 'POS',
      description: 'chromosome position',
    },
    {
      column: 'REF',
      description: 'reference and non-effect allele',
    },
    {
      column: 'ALT',
      description: 'alternative and effect allele (beta is for this allele)',
    },
    {
      column: 'SNP',
      description: '#CHR:POS:REF:ALT',
    },
    {
      column: 'all_meta_N',
      description:
        'number of studies that had the variant after AF and INFO filtering and as such were used for the meta',
    },
    {
      column: 'all_inv_var_meta_beta',
      description: 'effect size on log(OR) scale',
    },
    {
      column: 'all_inv_var_meta_sebeta',
      description: 'standard error of effect size',
    },
    {
      column: 'all_inv_var_meta_p',
      description: 'p-value',
    },
    {
      column: 'all_inv_var_meta_cases',
      description: 'total number of cases',
    },
    {
      column: 'all_inv_var_meta_controls',
      description: 'total number of controls',
    },
    {
      column: 'all_inv_var_meta_effective',
      description: 'effective sample size',
    },
    {
      column: 'all_inv_var_het_p',
      description: "p-value from Cochran's Q heterogeneity test",
    },
    {
      column: 'all_meta_AF',
      description: 'allele frequency in the meta-analysis',
    },
    {
      column: 'rsid',
      description: 'risd',
    },
  ],
  authors: [
    {
      name: 'COVID19-HG data contributors',
      study: 'COVID19-HG',
      affiliation: 'Various',
    },
  ],
  studyAbbreviations: [
    {
      abbreviation: 'Amsterdam_UMC_COVID_study_group',
      full_name: 'Amsterdam UMC COVID study group',
    },
    {
      abbreviation: 'BRACOVID',
      full_name: 'Genetic determinants of COVID-19 complications in the Brazilian population',
    },
    {
      abbreviation: 'BelCovid',
      full_name: 'Genetic modifiers for COVID-19 related illness',
    },
    {
      abbreviation: 'BQC19',
      full_name: 'Biobanque Quebec COVID19',
    },
    {
      abbreviation: 'DECODE',
      full_name: 'deCODE',
    },
    {
      abbreviation: 'Corea',
      full_name: 'Genetics of COVID-related Manifestation',
    },
    {
      abbreviation: 'EstBB',
      full_name: 'Estonian Biobank',
    },
    {
      abbreviation: 'FinnGen',
      full_name: 'FinnGen',
    },
    {
      abbreviation: 'GENCOVID',
      full_name: 'GEN-COVID, reCOVID',
    },
    {
      abbreviation: 'genomicc',
      full_name: 'genomiCC',
    },
    {
      abbreviation: 'GNH',
      full_name: 'Genes & Health',
    },
    {
      abbreviation: 'Generation_Scotland',
      full_name: 'Generation Scotland',
    },
    {
      abbreviation: 'HOSTAGE',
      full_name: 'COVID19-Host(a)ge',
    },
    {
      abbreviation: 'Helix',
      full_name: 'Helix Exome+ COVID-19 Phenotypes',
    },
    {
      abbreviation: 'INTERVAL',
      full_name: 'UK Blood Donors Cohort',
    },
    {
      abbreviation: 'MGI',
      full_name: 'Michigan Genomics Initiative',
    },
    {
      abbreviation: 'MVP',
      full_name: 'Million Veterans Program',
    },
    {
      abbreviation: 'NTR',
      full_name: 'Netherlands Twin Register',
    },
    // {
    //   abbreviation: 'PHBB',
    //   full_name: 'Partners Healthcare Biobank',
    // },
    {
      abbreviation: 'PMBB',
      full_name: 'Penn Medicine Biobank',
    },
    {
      abbreviation: 'QGP',
      full_name: 'Qatar Genome Program',
    },
    {
      abbreviation: 'SPGRX',
      full_name:
        'Determining the Molecular Pathways and Genetic Predisposition of the Acute Inflammatory Process Caused by SARS-CoV-2',
    },
    {
      abbreviation: 'Stanford',
      full_name:
        'Genomic epidemiology of SARS-Cov-2 and host genetics in Coronavirus Disease 2019 (COVID-19)',
    },
    {
      abbreviation: 'SweCovid',
      full_name: 'The genetic predisposition to severe COVID-19',
    },
    {
      abbreviation: 'UKBB',
      full_name: 'UK Biobank',
    },
    { abbreviation: 'BoSCO', full_name: 'Bonn Study of COVID19 genetics' },
    { abbreviation: '23ANDME', full_name: '23andMe' },
    // { abbreviation: 'Italy_HOSTAGE', full_name: 'Italy COVID19-Host(a)ge' },
    // { abbreviation: 'Spain_HOSTAGE', full_name: 'Spain COVID19-Host(a)ge' },
    { abbreviation: 'genomicsengland100kgp', full_name: 'Genomics England' },
    { abbreviation: 'Lifelines', full_name: 'Lifelines' },
    // { abbreviation: 'GeneRISK', full_name: 'Gene Risk' },
    // { abbreviation: 'RS', full_name: 'Rotterdam Study' },

    { abbreviation: 'CU', full_name: 'Columbia University COVID19 Biobank' },
    { abbreviation: 'GHS_Freeze_145', full_name: 'Geisinger Health System' },
    { abbreviation: 'JapanTaskForce', full_name: 'Japan Coronavirus Taskforce' },
    { abbreviation: 'idipaz24genetics', full_name: '24Genetics' },
    { abbreviation: 'FHoGID', full_name: 'FHoGID' },
    // { abbreviation: 'UCLA', full_name: 'UCLA Precision Health COVID-19 Biobank' },
    {
      abbreviation: 'Genetics_COVID19_Korea',
      full_name: 'Genetic influences on severity of COVID-19 illness in Korea',
    },
    { abbreviation: 'LGDB', full_name: 'Latvia COVID-19 research platform' },
    { abbreviation: 'ACCOuNT', full_name: 'ACCOuNT' },
    { abbreviation: 'BioVU', full_name: 'Vanderbilt Biobank' },
    { abbreviation: 'CCPM', full_name: 'The Colorado Center for Personalized Medicine' },
    { abbreviation: 'GCAT', full_name: 'Genomes for Life' },
    { abbreviation: 'GFG', full_name: 'Genes for Good' },
    { abbreviation: 'Genotek', full_name: 'Genotek COVID-19 study' },
    // { abbreviation: 'MSHS_CGI', full_name: 'Mount Sinai Health System COVID-19 Genomics Initiative' },
    { abbreviation: 'TOPMed_CHRIS10K', full_name: 'TOPMed CHRIS' },
    { abbreviation: 'CHULACOVID', full_name: 'CHULACOVID' },
    { abbreviation: 'Egypt_hgCOVID_hub', full_name: 'Egypt hgCOVID hub' },
    { abbreviation: 'SaudiHumanGenomeProgram', full_name: 'Saudi Human Genome Program' },
    { abbreviation: 'INMUNGEN_CoV2', full_name: 'Variability in immune response genes and severity of SARS-CoV-2 infection (INMUNGEN-CoV2 study)' },
    { abbreviation: 'Vanda', full_name: 'Vanda COVID' },
    { abbreviation: 'ANCESTRY_Freeze_Four', full_name: 'Ancestry Freeze Four' },
    { abbreviation: 'CHOP_CAG', full_name: 'CHOP CAG' },
    { abbreviation: 'IranCovid', full_name: 'Iran Covid' },
    { abbreviation: 'CCHC_AMR', full_name: 'CCHC COVID-19 GWAS' },
    { abbreviation: 'Coronagenes', full_name: 'Coronagenes' },
    { abbreviation: 'EXCEED', full_name: 'EXCEED' },
    { abbreviation: 'HUNT', full_name: 'HUNT' },
    { abbreviation: 'MOBA', full_name: 'The Norwegian Mother, Father and Child Cohort Study' },
    { abbreviation: 'SINAI_COVID', full_name: 'Mount Sinai Health System COVID-19 Genomics Initiative' },
    { abbreviation: 'TwinsUK', full_name: 'TwinsUK' },
    { abbreviation: 'WGHS', full_name: "Women's Health Genome Study" },
    { abbreviation: 'thaicovid', full_name: 'Host genetic factors in COVID-19 patients in relation to disease susceptibility, disease severity and pharmacogenomics' },
    { abbreviation: 'TOPMed_Gardena', full_name: 'TOPMed Gardena' },
    { abbreviation: 'EraCORE', full_name: 'EraCore' },
  ].sort((a, b) => (a.full_name && b.full_name && a.full_name.toLowerCase() > b.full_name.toLowerCase()) ? 1 : -1),
  analyses,
}

const uniqueStudies = Array.from(
  new Set(
    analyses.reduce((studies, analysis) => [...studies, ...analysis.studies.map((study) => study.study)], [])
  )
).map((study) => study.split('_').slice(0, -1).join('_'))

const uniqueStudyAbbreviations = new Set(
  release.studyAbbreviations.reduce((abbreviations, study) => [...abbreviations, study.abbreviation], [])
)

const studiesWithoutAbbreviations = Array.from(uniqueStudies).filter(
  (study) => !uniqueStudyAbbreviations.has(study)
)
const studiesWithoutData = Array.from(uniqueStudyAbbreviations).filter(
  (study) => !uniqueStudies.includes(study)
)

if (studiesWithoutAbbreviations.length > 1) {
  console.warn(studiesWithoutAbbreviations, 'do not have abbreviation defined')
}
if (studiesWithoutData.length > 1) {
  console.warn(studiesWithoutData, 'were not in dataset')
}

// const previousReleasesFileContents = fs.readFileSync('./previousReleases.yaml', 'utf8')

// const previousReleases = yaml.safeLoad(previousReleasesFileContents)

// const releases = { ...previousReleases, releases: [release, ...previousReleases.releases] }

const jsonString = JSON.stringify({
  templateKey: 'results-page',
  title: 'COVID19-hg GWAS meta-analyses round 6',
  release,
})

const json = JSON.parse(jsonString)

// console.log(json)

const releasesYamlStr = yaml.safeDump(json)

const releasesYamlStrWithDocumentSeperator = `---\n${releasesYamlStr}`

fs.writeFileSync('../../src/pages/results/r6.md', releasesYamlStrWithDocumentSeperator, 'utf8')
