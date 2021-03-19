import pandas as pd
import umap
import argparse

COLS_CLUSTER = [
    "candidate_votes_percentage_Ana Gomes",
    "candidate_votes_percentage_André Ventura",
    "candidate_votes_percentage_João Ferreira",
    "candidate_votes_percentage_Marcelo Rebelo de Sousa",
    "candidate_votes_percentage_Marisa Matias",
    "candidate_votes_percentage_Tiago Mayan Gonçalves",
    "candidate_votes_percentage_Vitorino Silva",
]


def pivot_parishes(df):
    pivot_table = df.reset_index().pivot_table(
        index="parish_territory_key",
        columns="candidate_name",
        values=["candidate_votes_percentage", "candidate_votes_count"],
    )
    pivot_table.columns = pivot_table.columns.map("_".join).str.strip("_")
    pivot_table = pivot_table.reset_index()

    df_by_parish = (
        pd.merge(
            pivot_table,
            df[
                [
                    "parish_territory_key",
                    "parish_name",
                    "county_name",
                    "region_name",
                    "parish_voters_percentage",
                    "parish_voters_count",
                    "parish_blank_percentage",
                    "parish_blank_count",
                    "parish_null_percentage",
                    "parish_null_count",
                ]
            ],
            on="parish_territory_key",
            how="outer",
        )
        .drop_duplicates()
        .reset_index()
    )

    return df_by_parish.reset_index()


def main(input_filename, output_filename):
    df = pd.read_json(input_filename)

    df_parishes = pivot_parishes(df)
    vectors = df_parishes[COLS_CLUSTER].values

    reducer = umap.UMAP(n_neighbors=50, min_dist=0.05, n_components=2)
    embedding = reducer.fit_transform(vectors)

    embedding_df = pd.concat(
        [
            pd.DataFrame(embedding, columns=["x", "y"]),
            df_parishes["parish_territory_key"].rename("dicofre"),
        ],
        axis=1,
    )
    embedding_df.to_json(output_filename, orient="records")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-i",
        "--input",
        help="input file name",
        type=str,
        required=True,
    )
    parser.add_argument(
        "-o",
        "--output",
        help="output file name",
        type=str,
        required=True,
    )
    args = parser.parse_args()
    main(args.input, args.output)
