---
templateKey: results-page
title: Results
releases:
  - date: May 15, 2020
    title: COVID19-hg GWAS meta-analyses round 2 
    notes: Meta-analysis was done with inverse variance weighting. Positions are on GRCh37. An AF filter of 0.0001 and an INFO filter of 0.6 was applied to each study prior to meta-analysis.
    data_columns:
      - column: "#CHR"
        description: chromosome
      - column: POS
        description: chromosome position in build 37
      - column: REF
        description: non-effect allele
      - column: ALT
        description: effect allele (beta is for this allele)
      - column: SNP
        description: "#CHR:POS:REF:ALT"
      - column: "{STUDY}_AF_Allele2"
        description: allele frequency in {STUDY}
      - column: all_meta_N
        description: number of studies that had the variant after AF and INFO filtering
          and as such were used for the meta
      - column: all_inv_var_meta_beta
        description: effect size on log(OR) scale
      - column: all_inv_var_meta_sebeta
        description: standard error of effect size
      - column: all_inv_var_meta_p
        description: p-value
      - column: all_inv_var_het_p
        description: p-value from Cochran's Q heterogeneity test
    authors:
      - name: Lude Franke
        study: Lifelines
        affiliation: Department of Genetics, University Medical Centre Groningen, University
          of Groningen
      - name: Marike Boezen
        study: Lifelines
        affiliation: Department of Epidemiology, University Medical Centre Groningen, University
          of Groningen
      - name: Patrick Deelen
        study: Lifelines
        affiliation: Department of Genetics, University Medical Centre Groningen, University
          of Groningen
      - name: Annique Claringbould
        study: Lifelines
        affiliation: Department of Genetics, University Medical Centre Groningen, University
          of Groningen
      - name: Esteban Lopera
        study: Lifelines
        affiliation: Department of Genetics, University Medical Centre Groningen, University
          of Groningen
      - name: David A van Heel
        study: Genes & Health
        affiliation: Queen Mary University of London
      - name: Bhavi Trivedi
        study: Genes & Health
        affiliation: Queen Mary University of London
      - name: Karen A Hunt
        study: Genes & Health
        affiliation: Queen Mary University of London
      - name: Qinqin Huang
        study: Genes & Health
        affiliation: Wellcome Sanger Institute
      - name: Richard C Trembath
        study: Genes & Health
        affiliation: Kings College London
      - name: Genes & Health Research Team
        study: Genes & Health
        affiliation: Queen Mary University of London
      - name: Finngen
        study: Finngen
        affiliation: Institute for Molecular Medicine Finland, University of Helsinki
      - name: Arden Moscati
        study: BioMe
        affiliation: The Charles Bronfman Institute for Personalized Medicine, Icahn School
          of Medicine at Mount Sinai, New York, NY
      - name: Judy H. Cho
        study: BioMe
        affiliation: The Charles Bronfman Institute for Personalized Medicine, Icahn School
          of Medicine at Mount Sinai, New York, NY
      - name: Ruth J.F. Loos
        study: BioMe
        affiliation: The Charles Bronfman Institute for Personalized Medicine, Icahn School
          of Medicine at Mount Sinai, New York, NY
      - name: Elizabeth T. Cirulli
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: Kelly M. Schiabor
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: Stephen Riffle
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: Alexandre Bolze
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: Simon White
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: Francisco Tanudjaja
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: Elissa Levin
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: Sarah Bobulsky
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: Nicole L. Washington
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: James T. Lu
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: Xueqing Wang
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: Jimmy M. Ramirez III
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: Yan Wei Lim
        study: Helix Exome+ COVID-19 Phenotypes
        affiliation: Helix
      - name: Eco de Geus
        study: Netherlands Twin Register
        affiliation: Department of Biological Psychology, Vrije Universiteit Amsterdam
      - name: Meike Bartels
        study: Netherlands Twin Register
        affiliation: Department of Biological Psychology, Vrije Universiteit Amsterdam
      - name: Jouke-Jan Hottenga
        study: Netherlands Twin Register
        affiliation: Department of Biological Psychology, Vrije Universiteit Amsterdam
      - name: Daniel J Wilson
        study: UK Biobank
        affiliation: University of Oxford
      - name: Nicolas Arning
        study: UK Biobank
        affiliation: University of Oxford
      - name: Jacob Armstrong
        study: UK Biobank
        affiliation: University of Oxford
      - name: Justine Rudkin
        study: UK Biobank
        affiliation: University of Oxford
      - name: Gavin Band
        study: UK Biobank
        affiliation: University of Oxford
      - name: Sarah G Earle
        study: UK Biobank
        affiliation: University of Oxford
      - name: Naomi Allen
        study: UK Biobank
        affiliation: UK Biobank
      - name: Derrick W Crook
        study: UK Biobank
        affiliation: University of Oxford
      - name: David H Wyllie
        study: UK Biobank
        affiliation: Public Health England
      - name: Anne-Marie O'Connell
        study: UK Biobank
        affiliation: Public Health England
      - name: Tomoko Nakanishi
        study: UK Biobank
        affiliation: Department of Human Genetics, McGill University, Montréal, Québec,
          Canada
      - name: Vincenzo Forgetta
        study: UK Biobank
        affiliation: Centre for Clinical Epidemiology, Department of Medicine, Lady Davis
          Institute for Medical Research, Jewish General Hospital, McGill University, Montréal,
          Québec, Canada
      - name: Guillaume Butler-Laporte
        study: UK Biobank
        affiliation: Department of Human Genetics, McGill University, Montréal, Québec,
          Canada
      - name: J. Brent Richards
        study: UK Biobank
        affiliation: Department of Human Genetics, McGill University, Montréal, Québec,
          Canada
      - name: Konrad J. Karczewski
        study: UK Biobank
        affiliation: Analytical and translational genetics unit, Massachusetts General Hospital,
          Boston, USA
      - name: Elizabeth G. Atkinson
        study: UK Biobank
        affiliation: Analytical and translational genetics unit, Massachusetts General Hospital,
          Boston, USA
      - name: Masahiro Kanai
        study: UK Biobank
        affiliation: Analytical and translational genetics unit, Massachusetts General Hospital,
          Boston, USA
      - name: Nikolas Baya
        study: UK Biobank
        affiliation: Analytical and translational genetics unit, Massachusetts General Hospital,
          Boston, USA
      - name: Patrick Turley
        study: UK Biobank
        affiliation: Analytical and translational genetics unit, Massachusetts General Hospital,
          Boston, USA
      - name: Raymond K. Walters
        study: UK Biobank
        affiliation: Analytical and translational genetics unit, Massachusetts General Hospital,
          Boston, USA
      - name: Duncan S. Palmer
        study: UK Biobank
        affiliation: Analytical and translational genetics unit, Massachusetts General Hospital,
          Boston, USA
      - name: Sam Bryant
        study: UK Biobank
        affiliation: Analytical and translational genetics unit, Massachusetts General Hospital,
          Boston, USA
      - name: Claire Churchhouse
        study: UK Biobank
        affiliation: Analytical and translational genetics unit, Massachusetts General Hospital,
          Boston, USA
      - name: Hilary Finucane
        study: UK Biobank
        affiliation: Analytical and translational genetics unit, Massachusetts General Hospital,
          Boston, USA
      - name: Alicia R. Martin
        study: UK Biobank
        affiliation: Analytical and translational genetics unit, Massachusetts General Hospital,
          Boston, USA
      - name: Scott Weiss
        study: Greater Boston COVID-19 Host Disease Initiative
        affiliation: Brigham and Women’s hospital
      - name: Beth Karlson
        study: Greater Boston COVID-19 Host Disease Initiative
        affiliation: Brigham and Women’s hospital
      - name: Jordan Smoller
        study: Greater Boston COVID-19 Host Disease Initiative
        affiliation: Mass General Hospital
      - name: Sue Slaugenhaupt
        study: Greater Boston COVID-19 Host Disease Initiative
        affiliation: Mass General Hospital
      - name: Robert Green
        study: Greater Boston COVID-19 Host Disease Initiative
        affiliation: Brigham and Women’s hospital
      - name: Anne Feng
        study: Greater Boston COVID-19 Host Disease Initiative
        affiliation: Mass General Hospital
      - name: Josep Mercader
        study: Greater Boston COVID-19 Host Disease Initiative
        affiliation: Mass General Hospital
      - name: Shawn Murphy
        study: Greater Boston COVID-19 Host Disease Initiative
        affiliation: Mass General Hospital
      - name: James Meigs
        study: Greater Boston COVID-19 Host Disease Initiative
        affiliation: Mass General Hospital
      - name: Anne Wooley
        study: Greater Boston COVID-19 Host Disease Initiative
        affiliation: Brigham and Women’s hospital
      - name: Emma Perez
        study: Greater Boston COVID-19 Host Disease Initiative
        affiliation: Brigham and Women’s hospital
      - name: Karolina Chwialkowska
        study: Admin and Analysis Team
        affiliation: Various
      - name: Margherita Francescatto
        study: Admin and Analysis Team
        affiliation: Various
      - name: Amy Trankiem 
        study: Admin and Analysis Team
        affiliation: Various
      - name: Matthew Solomonson
        study: Admin and Analysis Team
        affiliation: Various
      - name: Rachel Liao  
        study: Admin and Analysis Team
        affiliation: Various
      - name: Huy Nguyen
        study: Admin and Analysis Team
        affiliation: Various
      - name: Juha Karjalainen 
        study: Admin and Analysis Team
        affiliation: Various
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
        download:
          name: COVID19_HGI_ANA2_20200513.txt.gz 
          gz_url: https://storage.googleapis.com/covid19-hg-public/20200508/results/COVID19_HGI_ANA2_20200513.txt.gz
          tbi_url: https://storage.googleapis.com/covid19-hg-public/20200508/results/COVID19_HGI_ANA2_20200513.txt.gz.tbi 
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
        download:
          name: COVID19_HGI_ANA5_20200513.txt.gz 
          gz_url: https://storage.googleapis.com/covid19-hg-public/20200508/results/COVID19_HGI_ANA5_20200513.txt.gz 
          tbi_url: https://storage.googleapis.com/covid19-hg-public/20200508/results/COVID19_HGI_ANA5_20200513.txt.gz.tbi 
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
        download:
          name: COVID19_HGI_ANA7_20200513.txt.gz	 
          gz_url: https://storage.googleapis.com/covid19-hg-public/20200508/results/COVID19_HGI_ANA7_20200513.txt.gz 
          tbi_url: https://storage.googleapis.com/covid19-hg-public/20200508/results/COVID19_HGI_ANA7_20200513.txt.gz.tbi 
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
