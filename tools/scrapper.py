#!/usr/bin/env python3

import requests
import argparse
import pandas as pd
from tqdm import tqdm


URL = "https://www.presidenciais2021.mai.gov.pt/frontend/data"
PT_TERRITORY_KEY = "LOCAL-500000"


def get_territory_children(territory_key):
    response = requests.get(f"{URL}/TerritoryChildren?territoryKey={territory_key}")
    return response.json()


def get_territory_results(territory_key, level):
    response = requests.get(
        f"{URL}/TerritoryResults?electionId=PR&territoryKey={territory_key}"
    )
    results = response.json()["currentResults"]

    territory_data = {
        f"{level}_voters_percentage": results["percentageVoters"],
        f"{level}_voters_count": results["numberVoters"],
        f"{level}_blank_percentage": results["blankVotesPercentage"],
        f"{level}_blank_count": results["blankVotes"],
        f"{level}_null_percentage": results["nullVotesPercentage"],
        f"{level}_null_count": results["nullVotes"],
    }

    candidate_results = results["resultsParty"]
    tidy_results = []

    for candidate in candidate_results:
        tidy_row = {
            "candidate_name": candidate["acronym"],
            "candidate_votes_percentage": candidate["validVotesPercentage"],
            "candidate_votes_count": candidate["votes"],
            **territory_data,
        }

        tidy_results.append(tidy_row)

    return tidy_results


def get_full_results_df(regions):
    results = []
    for region in tqdm(regions, desc="Districts"):
        counties = get_territory_children(region["territoryKey"])
        for county in tqdm(counties, desc=f"Counties in {region['name']}"):
            parishes = get_territory_children(county["territoryKey"])
            for parish in parishes:
                candidates_results_in_parish = get_territory_results(
                    parish["territoryKey"], "parish"
                )

                for candidate_result in candidates_results_in_parish:
                    row = {
                        "region_name": region["name"],
                        "region_territory_key": region["territoryKey"].replace("LOCAL-", ""),
                        "county_name": county["name"],
                        "county_territory_key": county["territoryKey"].replace("LOCAL-", ""),
                        "parish_name": parish["name"],
                        "parish_territory_key": parish["territoryKey"].replace("LOCAL-", ""),
                        **candidate_result,
                    }

                    results.append(row)

    return pd.DataFrame(results)


def main(output_filename, file_format):
    regions = get_territory_children(PT_TERRITORY_KEY)
    results_df = get_full_results_df(regions)

    if file_format == "csv":
        results_df.to_csv(output_filename, index=False)
    elif file_format == "json":
        results_df.to_json(output_filename, orient="records")
    else:
        print(results)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-o",
        "--output",
        help="output file name",
        type=str,
        required=True,
    )
    parser.add_argument(
        "-f",
        "--format",
        help="output file format",
        type=str,
        choices=["csv", "json"],
        required=True,
    )
    args = parser.parse_args()
    main(args.output, args.format)