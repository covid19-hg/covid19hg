---
templateKey: results-page
title: Results
releases:
  - date: May 15, 2020
    title: COVID19-hg GWAS meta-analyses round 2 
    notes: Meta-analysis was done with inverse variance weighting. Positions are on GRCh37. An AF filter of 0.0001 and an INFO filter of 0.6 was applied to each study prior to meta-analysis.
    studyAbbreviations:
      - abbreviation: BioMe_RGN
        full_name: BioMe
      - abbreviation: FinnGen
        full_name: FinnGen
      - abbreviation: GNH
        full_name: Genes & Health
      - abbreviation: Helix
        full_name: Helix Exome+ COVID-19 Phenotypes
      - abbreviation: LifelinesCyto
        full_name: LifeLines Global Screening Array
      - abbreviation: LifelinesGsa
        full_name: LifeLines CytoSNP
      - abbreviation: NTR
        full_name: Netherlands Twin Register
      - abbreviation: PHBB
        full_name: Partners Healthcare Biobank
      - abbreviation: UKBB
        full_name: UK Biobank
    analyses:
      - name: 20200508-results-ANA2_inv_var_meta
        phenotype: ANA2, Hospitalized vs. non-hospitalized 	
        population: All
        gz: gs://covid19-hg-public/20200508/results/ANA2_ALL_inv_var_meta.gz 
        tbi: gs://covid19-hg-public/20200508/results/ANA2_ALL_inv_var_meta.gz.tbi
        manhattan:
          image: /img/ANA2_inv_var_meta_p_all_inv_var_meta_p_manhattan.png
        qqplot:
          image: /img/ANA2_inv_var_meta_p_all_inv_var_meta_p_qqplot.png
        studies:
          - study: FinnGen_FIN
            cases: 30
            controls: 179
          - study: GNH_SAS
            cases: 34
            controls: 13
          - study: LifelinesGsa_EUR
            cases: 6
            controls: 183
          - study: PHBB_EUR
            cases: 17
            controls: 57
          - study: UKBB_EUR
            cases: 629
            controls: 184
      - name: 20200508-results-ANA5_ALL_inv_var_meta
        phenotype: ANA5, susceptibility (affected vs. population) 
        population: All
        gz: gs://covid19-hg-public/20200508/results/ANA5_ALL_inv_var_meta.gz 
        tbi: gs://covid19-hg-public/20200508/results/ANA5_ALL_inv_var_meta.gz.tbi
        manhattan:
          image: /img/ANA5_ALL_inv_var_meta_p_all_inv_var_meta_p_manhattan.png
        qqplot:
          image: /img/ANA5_ALL_inv_var_meta_p_all_inv_var_meta_p_qqplot.png 
        studies:
          - study: BioMe_RGN_EUR
            cases: 20
            controls: 10169
          - study: FinnGen_FIN
            cases: 209
            controls: 203431
          - study: GNH_SAS
            cases: 64
            controls: 27351
          - study: LifelinesCyto_EUR
            cases: 62
            controls: 5750
          - study: LifelinesGsa_EUR
            cases: 189
            controls: 15975
          - study: NTR_CEU
            cases: 163
            controls: 3160
          - study: PHBB_AFR
            cases: 34
            controls: 2169
          - study: PHBB_EUR
            cases: 74
            controls: 28950
          - study: UKBB_AFR
            cases: 51
            controls: 6585
          - study: UKBB_EUR
            cases: 812
            controls: 371095
      - name: 20200508-results-ANA7_inv_var_meta
        phenotype: ANA7, COVID-19 predicted by flu-like symptoms 
        population: European
        gz: gs://covid19-hg-public/20200508/results/ANA7_inv_var_meta.gz
        tbi: gs://covid19-hg-public/20200508/results/ANA7_inv_var_meta.gz.tbi
        manhattan:
          image: /img/ANA7_inv_var_meta_p_all_inv_var_meta_p_manhattan.png
        qqplot:
          image: /img/ANA7_inv_var_meta_p_all_inv_var_meta_p_qqplot.png
        studies:
          - study: LifelinesGsa_EUR
            cases: 443
            controls: 15406
          - study: LifelinesCyto_EUR
            cases: 194
            controls: 5451
          - study: Helix_EUR
            cases: 657
            controls: 6112

---


