---
templateKey: blog-post
title: In-silico follow-up results
date: 2020-06-29T13:17:16.411Z
featuredpost: true
featuredimage: ''
tags:
  - '#in-silico'
type: blog-post
---
# In-silico follow-up results

Here we post the results from the in-silico follow up analysis done of summary statistics from release 3.

## Heritability and genetic correlations

**Summary:**

**Authors:**

**Results available here**

## TWAS

**Summary:**

**Authors:**

**Results available here**

## **Fine Mapping**

**Summary:**

**Authors:**

**Results available here**



## Summary-data-based Mendelian Randomization

**Summary:** Summary-data based Mendelian Randomization (SMR) analyses of the COVID-19 GWAS summary statistics (ANA_C2_V2).

This analysis aims at detecting colocalisation of GWAS signal (p<1e-5) with methylation and expression quantitative traits loci (mQTL and eQTL respectly) from 11 mQTL and eQTL datasets (ref:<https://cnsgenomics.com/software/smr/#DataResource>). Top SMR results (p<1e-5) are reported. This archive contains two README files (\*.txt and \*.docx format), 2 SMR plots and a result file. Columns of the result file are described here:<https://cnsgenomics.com/software/smr/#SMR&HEIDIanalysis>.

**Authors:** Loic Yengo, Peter Visscher & Naomi Wray

**Results available [here](https://console.cloud.google.com/storage/browser/covid19-hg-in-silico-followup/SMR/?project=covid-19-hg&authuser=0&organizationId=548622027621)**

## PheWAS

**Summary:** PheWAS analysis in the UK Biobank using GP and Hospital Episode Statistics (HES) data. Genetic Score based on COVID-19 associated SNPs. LD clumping was performed at SNPs with Pvalue<10-5, r2=0.1. No outcome passed Bonferroni correction.

**Authors:** Areti Papadopoulou - Eirini Marouli

**Results available [here](https://console.cloud.google.com/storage/browser/covid19-hg-in-silico-followup/phewas/?project=covid-19-hg&authuser=0&organizationId=548622027621)**



## S-PrediXcan/MetaXcan

**Summary:**  Variation in the human genome is expected to determine part of the individual susceptibility to COVID-19 severity and outcomes. The differences in the frequency of the genetic variants with respect to the phenotype-of-interest have small yet cumulative effect on the human transcriptome. In a transcriptome-wide association study (TWAS), the effects of genetic variants are aggregated for gene expression and tested for association with the phenotype-of-interest, reducing the multiple-testing burden with respect to a single-variant association analysis. Here, we performed TWAS using S-PrediXcan with GTEx v8 MASHR (multivariate adaptive shrinkage in R) model for lung and whole blood tissue. The MASHR models are provided at the developers host site (https://github.com/hakyimlab/MetaXcan/blob/master/README.md). The GTEx contains genotype-gene-expression data for 54 tissues from 838 donors (https://www.gtexportal.org/home/).  

We performed TWAS based on the genome-wide association data for each of the six phenotypes released for COVID19-HGI Freeze3 on June 28, 2020 (https://www.covid19hg.org/results/).   The S-PrediXcan (alternatively known as MetaXcan) framework consists of two prediction models for GTEx v8; we used the MASHR-based model for deriving eQTL values. The MASHR model is biologically informed, with fine mapped variables (1). The variants and LD was used for EUR ancestry. The Bonferroni-corrected significance threshold accounting for the number of phenotypes, genes, and tissues tested is p-value = 2.77e-7. Significant associations were observed for BET1L (whole blood; phenotype-B1_V2 p-value = 2.33e-7) and CCR9 (whole blood; phenotype-B2_V2 p-value = 1.00e-14 | phenotype-C2_V2 p-value=9.10e-9). The detailed report is available in the link below

**Authors:**  Gita A Pathak, Frank R Wendt, Renato Polimanti

**Results available [here](https://console.cloud.google.com/storage/browser/covid19-hg-in-silico-followup/PrediXcan/?project=covid-19-hg&authuser=0&organizationId=548622027621)**