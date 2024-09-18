library(stringr)
# CCP ontology ----

r = read.csv("raw_data/ccp_ontology.csv") |> unique()
r = r[r$Key != "",]
r$td = str_c(r$Label, ": ", r$Description)
r$td_count = str_count(r$td)
writeLines(r$td, "data/ccp_td.txt")
writeLines(r$Label, "data/ccp_labels.txt")
writeLines(r$Description, "data/ccp_descriptions.txt")

# IDEA constitutional topics ontology ----

idea_fpaths = list.files("raw_data", full.names = T, pattern = "Ontology")
l = lapply(idea_fpaths, read.csv)
df_idea = do.call(rbind, l)

df_idea$td = str_c(df_idea$Topic, ": ", df_idea$Description)
df_idea$td_count = str_count(df_idea$td)
df_idea = df_idea[df_idea$td_count < 200,]

writeLines(
    c(r$td, df_idea$td), "data/merged_td.txt"
)

writeLines(
    c(rep("CCP", nrow(r)), rep("IDEA", nrow(df_idea))),
    "data/merged_td_ont.txt"
)

writeLines(df_idea$td, "data/idea_td.txt")
writeLines(df_idea$Topic, "data/idea_labels.txt")
writeLines(df_idea$Description, "data/idea_descriptions.txt")
