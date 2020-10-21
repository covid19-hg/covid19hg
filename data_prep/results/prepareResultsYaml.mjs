import fs from 'fs'
import yaml from 'js-yaml'

const RESULTS_URL = 'https://storage.googleapis.com/covid19-hg-public/20200915/results/20201020'

const VERSION = '20201020'

const RESULTS_PREFIX = 'COVID19_HGI'

const B37_GZ_SUFFIX = '.b37.txt.gz'
// const B37_TBI_SUFFIX = '.b37.txt.gz.tbi'
const B37_FILTERED_SUFFIX = '.b37_1.0E-5.txt'

const B38_GZ_SUFFIX = '.txt.gz'
// const B38_TBI_SUFFIX = '.txt.gz.tbi'
const B38_FILTERED_SUFFIX = '.txt.gz_1.0E-5.txt'
const B38_23ANDME_GZ_SUFFIX = '.10k.txt.gz'

const PLOT_FOLDER = '/img/201020'
const MANHATTAN_SUFFIX = 'inv_var_meta_p_flag_all_inv_var_meta_p_manhattan.png'
const QQPLOT_SUFFIX = 'inv_var_meta_p_flag_all_inv_var_meta_p_qqplot.png'

let analyses = [
  {
    analysis_id: 'A1_ALL',
    phenotype: 'Very severe respiratory confirmed covid vs. not hospitalized covid',
    population: 'all',
    includes23AndMe: false,
  },
  {
    analysis_id: 'A2_ALL',
    phenotype: 'Very severe respiratory confirmed covid vs. population',
    population: 'All',
    includes23AndMe: true,
  },
  { analysis_id: 'B1_ALL', phenotype: 'Hospitalized covid vs. not hospitalized covid', population: 'All' },
  {
    analysis_id: 'B2_ALL_eur_leave_23andme',
    phenotype: 'Hospitalized covid vs. population, leave out 23andMe',
    population: 'Eur',
    noPlots: true,
    dirPrefix: 'eur',
  },
  {
    analysis_id: 'B2_ALL',
    phenotype: 'Hospitalized covid vs. population',
    population: 'All',
    includes23AndMe: true,
  },
  {
    analysis_id: 'C1_ALL',
    phenotype: 'Covid vs. lab/self-reported negative',
    population: 'All',
    includes23AndMe: true,
  },
  { analysis_id: 'C2_ALL', phenotype: 'Covid vs. population', population: 'All', includes23AndMe: true },
  {
    analysis_id: 'C2_ALL_eur_leave_23andme',
    phenotype: 'Covid vs. population, leave out 23andMe',
    population: 'Eur',
    noPlots: true,
    dirPrefix: 'eur',
  },
  {
    analysis_id: 'D1_ALL',
    phenotype: 'Predicted covid from self-reported symptoms vs. predicted or self-reported non-covid',
    population: 'All',
  },
]

analyses = analyses.map((analysis) => ({
  ...analysis,
  meta: JSON.parse(fs.readFileSync(`./metadata/${analysis.analysis_id}.json`)).meta,
}))

analyses = analyses.map((analysis) => ({
  ...analysis,
  studies: analysis.meta.map((s) => ({ study: s.name, cases: s.n_cases, controls: s.n_controls })),
}))

const downloadTypes = [
  { type: 'grch37_gz', description: 'GRCh37 liftover', suffix: B37_GZ_SUFFIX },
  // { type: "grch37_tbi", description: "GRCh37 (.tbi)", suffix: B37_TBI_SUFFIX },
  { type: 'grch37_filtered', description: 'GRCh37 (filtered)', suffix: B37_FILTERED_SUFFIX },
  { type: 'grch38_gz', description: 'GRCh38', suffix: B38_GZ_SUFFIX },
  // { type: "grch38_tbi", description: "GRCh38 (.tbi)", suffix: B38_TBI_SUFFIX },
  { type: 'grch38_filtered', description: 'GRCh38 (filtered)', suffix: B38_FILTERED_SUFFIX },
  { type: 'grch38_with_23andme', description: 'GRCh38 with 23andMe 10K', suffix: B38_23ANDME_GZ_SUFFIX },
]

analyses = analyses.map((analysis) => {
  let version = analysis.includes23AndMe ? `leave_23andme_${VERSION}` : VERSION
  return {
    ...analysis,
    downloads: downloadTypes
      .filter((downloadType) => {
        if (!analysis.includes23AndMe && downloadType.type === 'grch38_with_23andme') {
          return false
        }
        return true
      })
      .map((downloadType) => {
        version = downloadType.type === 'grch38_with_23andme' ? VERSION : version

        const fileName = `${RESULTS_PREFIX}_${analysis.analysis_id}_${version}${downloadType.suffix}`

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
      manhattan: { image: `${PLOT_FOLDER}/${analysis.analysis_id}_${MANHATTAN_SUFFIX}` },
      qqplot: { image: `${PLOT_FOLDER}/${analysis.analysis_id}_${QQPLOT_SUFFIX}` },
    }
  } else {
    return analysis
  }
})

analyses = analyses.map((analysis) => {
  const {
    analysis_id,
    population,
    phenotype,
    downloads,
    manhattan,
    qqplot,
    studies,
    includes23AndMe,
  } = analysis
  return { name: analysis_id, population, phenotype, downloads, manhattan, qqplot, studies, includes23AndMe }
})

const release = {
  date: 'October 20, 2020',
  title: 'COVID19-hg GWAS meta-analyses round 4',
  notes:
    'Meta-analysis was done with fixed effects inverse variance weighting.Results are available in genome builds 38 and 37. An AF filter of 0.001 and an INFO filter of 0.6 was applied to each study before meta.',
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
      column: '{STUDY}_AF_Allele2',
      description: 'allele frequency in {STUDY} or 0.5 if not available',
    },
    {
      column: '{STUDY}_AF_fc',
      description:
        'allele frequency in {STUDY} / allele frequency in gnomAD v3 (1000000 if frequency in gnomAD is 0)',
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
      column: 'all_inv_var_het_p',
      description: "p-value from Cochran's Q heterogeneity test",
    },
    {
      column: 'all_meta_sample_N',
      description: 'total sample size',
    },
    {
      column: 'all_meta_AF',
      description: 'allele frequency in the meta-analysis',
    },
    {
      column: 'rsid',
      description: 'risd',
    },
    {
      column: 'AF_fc',
      description:
        "calculated based on each study's ancestry in gnomAD or all populations if the ancestry is not present in gnomAD",
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
      abbreviation: 'Ancestry',
      full_name: 'Ancestry',
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
      full_name: '(Genetics of COVID-related Manifestation)',
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
      abbreviation: 'GS',
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
    {
      abbreviation: 'PHBB',
      full_name: 'Partners Healthcare Biobank',
    },
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
    { abbreviation: 'Italy_HOSTAGE', full_name: 'Italy COVID19-Host(a)ge' },
    { abbreviation: 'Spain_HOSTAGE', full_name: 'Spain COVID19-Host(a)ge' },
    { abbreviation: 'genomicsengland100kgp', full_name: 'Genomics England' },
    { abbreviation: 'Lifelines', full_name: 'Lifelines' },
    { abbreviation: 'GeneRISK', full_name: 'Gene Risk' },
    { abbreviation: 'RS', full_name: 'Rotterdam Study' },
  ],
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

const previousReleasesFileContents = fs.readFileSync('./previousReleases.yaml', 'utf8')

const previousReleases = yaml.safeLoad(previousReleasesFileContents)

const releases = { ...previousReleases, releases: [release, ...previousReleases.releases] }

const jsonString = JSON.stringify(releases)

const json = JSON.parse(jsonString)

const releasesYamlStr = yaml.safeDump(json)

const releasesYamlStrWithDocumentSeperator = `---\n${releasesYamlStr}`

fs.writeFileSync('../../src/pages/results/index.md', releasesYamlStrWithDocumentSeperator, 'utf8')
