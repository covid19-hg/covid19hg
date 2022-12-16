.PHONY: clean

PLOT_DIR=../../static/img/20220403

metadata:
	mkdir -p metadata

	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL.json" metadata/
	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL_leave_23andme.json" metadata/

	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL_his.json" metadata/
	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL_his_leave_23andme.json" metadata/

	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL_eur.json" metadata/
	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL_eur_leave_23andme.json" metadata/

	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL_afr.json" metadata/
	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL_afr_leave_23andme.json" metadata/

	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL_eas_leave_23andme.json" metadata/
	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL_eas.json" metadata/

	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL_sas_leave_23andme.json" metadata/
	gsutil cp "gs://covid19-hg-analysis/20211031/conf/json/*_ALL_sas.json" metadata/

plots:
	mkdir -p $(PLOT_DIR)
	gsutil -m cp -r "gs://covid19-hg-analysis/20211031/results/main/png/*.png" $(PLOT_DIR)/
	gsutil -m cp -r "gs://covid19-hg-analysis/20211031/results/pop_spec/png/*.png" $(PLOT_DIR)/

clean:
	rm -rf metadata

results: metadata 
	node prepareResultsYaml.mjs

