#!/usr/bin/env python3

import requests
from tqdm import tqdm


URL = "https://www.presidenciais2021.mai.gov.pt/frontend/data"
PT_TERRITORY_KEY = "LOCAL-500000"


def get_territory_children(territory_key):
    response = requests.get(f"{URL}/TerritoryChildren?territoryKey={territory_key}")
    return response.json()


def get_territory_results(territory_key):
    response = requests.get(
        f"{URL}/TerritoryResults?electionId=PR&territoryKey={territory_key}"
    )
    results = response.json()["currentResults"]

    territory_data = {
        "territory_voters_percentage": results["percentageVoters"],
        "territory_voters_count": results["numberVoters"],
        "territory_blank_percentage": results["blankVotesPercentage"],
        "territory_blank_count": results["blankVotes"],
        "territory_null_percentage": results["nullVotesPercentage"],
        "territory_null_count": results["nullVotes"],
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


def get_full_results(regions):
    results = []
    for region in tqdm(regions):
        cities = get_territory_children(region["territoryKey"])
        for city in cities:

            candidates_results_in_city = get_territory_results(city["territoryKey"])

            for candidate_result in candidates_results_in_city:
                row = {
                    "region_name": region["name"],
                    # "region_territory_key": region["territoryKey"],
                    "city_name": city["name"],
                    # "city_territory_key": city["territoryKey"],
                    **candidate_result,
                }

                results.append(row)

    return results


def main():
    regions = get_territory_children(PT_TERRITORY_KEY)
    return get_full_results(regions)


if __name__ == "__main__":
    print(main())
