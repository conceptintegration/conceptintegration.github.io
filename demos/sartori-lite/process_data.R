r = read.csv("ccp_ontology.csv") |> unique()
r = r[r$Key != "",]

writeLines(r$Label, "ccp_labels.txt")
writeLines(r$Description, "ccp_descriptions.txt")
