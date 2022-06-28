.PHONY: clean

PLOT_DIR=../../static/img/20220403

metadata:
	mkdir -p metadata

	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL.json" metadata/
	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL_leave_23andme.json" metadata/

plots:
	mkdir -p $(PLOT_DIR)
	gsutil -m cp -r "gs://covid19-hg-analysis/20211031/results/main/png/*.png" $(PLOT_DIR)/

clean:
	rm -rf metadata

results: metadata 
	node prepareResultsYaml.mjs

