.PHONY: clean

PLOT_DIR=../../../static/img/201020

metadata:
	mkdir -p metadata
	gsutil cp gs://covid19-hg-analysis/20200915/conf/5/*_ALL.json metadata/
	gsutil cp gs://covid19-hg-analysis/20200915/conf/5/B2_ALL_eur_leave_23andme.json metadata/
	gsutil cp gs://covid19-hg-analysis/20200915/conf/5/C2_ALL_eur_leave_23andme.json metadata/

plots:
	mkdir -p $(PLOT_DIR)
	gsutil -m cp -r "gs://covid19-hg-public/20200915/plots/20201020/*" $(PLOT_DIR)/


clean:
	rm -rf metadata

results: plots metadata 
	node prepareResultsYaml.mjs

