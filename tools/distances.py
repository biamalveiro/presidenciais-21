import pandas as pd
import argparse
from scipy.spatial.distance import pdist, squareform


def main(input_parishes_filename, input_total_filename, output_filename):
    df_parish = pd.read_json(input_parishes_filename)
    df_pt = pd.read_json(input_total_filename)
    df_total = pd.concat([df_parish, df_pt])

    df_pivot = df_total.reset_index().pivot_table(
        index="parish_territory_key",
        columns="candidate_name",
        values=["candidate_votes_percentage"],
    )
    df_pivot.columns = df_pivot.columns.map("_".join).str.strip("_")
    df_pivot = df_pivot.reset_index()

    l1_distance_matrix = squareform(
        pdist(df_pivot.iloc[:, 1:].values, metric="cityblock")
    )

    distance_matrix_df = pd.DataFrame(
        l1_distance_matrix, columns=df_pivot["parish_territory_key"]
    )
    distance_matrix_df["parish_territory_key"] = df_pivot["parish_territory_key"]
    distance_matrix_df.to_json(output_filename, orient="records")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-p",
        "--parishes",
        help="parishes input file name",
        type=str,
        required=True,
    )
    parser.add_argument(
        "-t",
        "--total",
        help="total input file name",
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
    main(args.parishes, args.total, args.output)