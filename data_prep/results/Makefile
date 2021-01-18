.PHONY: clean

PLOT_DIR=../../static/img/20210118

metadata:
	mkdir -p metadata

	#gsutil ls "gs://covid19-hg-analysis/20201215/conf/5_filtered/json/*_ALL.json"
	gsutil cp "gs://covid19-hg-analysis/20201215/conf/5_filtered/json/*ALL_leave_23andme.json" metadata/
	gsutil cp "gs://covid19-hg-analysis/20201215/conf/5_filtered/json/*ALL_leave_UKBB.json" metadata/
	gsutil cp "gs://covid19-hg-analysis/20201215/conf/5_filtered/json/*ALL_eur.json" metadata/
	gsutil cp "gs://covid19-hg-analysis/20201215/conf/5_filtered/json/*ALL_eur_leave_ukbb.json" metadata/

plots:
	mkdir -p $(PLOT_DIR)
	gsutil -m cp -r "gs://covid19-hg-public/20201215/plots/20210107/*" $(PLOT_DIR)/


clean:
	rm -rf metadata

results: metadata 
	node prepareResultsYaml.mjs

