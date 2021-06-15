.PHONY: clean

PLOT_DIR=../../static/img/20210607

metadata:
	mkdir -p metadata

	gsutil cp "gs://covid19-hg-analysis/20210415/conf/6/json/*_ALL.json" metadata/
	gsutil cp "gs://covid19-hg-analysis/20210415/conf/6/json/*_ALL_leave_23andme.json" metadata/

plots:
	mkdir -p $(PLOT_DIR)
	gsutil -m cp -r "gs://covid19-hg-public/20210415/results/20210607/*.png" $(PLOT_DIR)/

clean:
	rm -rf metadata

results: metadata 
	node prepareResultsYaml.mjs

