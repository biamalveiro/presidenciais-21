const GET_PARISHES_SCATTER = `
    query {
        parishes(_size: 5000) {
            data {
                name,
                x,
                y,
                outlier,
                votes,
                dicofre
            }
        }
    }`;

const GET_PARISHES_LIST = `
    query {
        parishes(_size: 5000) {
            data {
                name,
                county,
                region,
                dicofre
            }
        }
    }`;

const GET_PARISH_BY_DICOFRE = `
    query ($dicofre: String!){
        parish (dicofre: $dicofre) {
            name,
            county,
            region,
            outlier,
            results
        }
    }
`;

const GET_PARISH_MAP = `
query ($dicofre: String!){
    parish (dicofre: $dicofre) {
                    name,
                    county,
                    region,
                    results
                    map,
                    neighbor,
                    outlier
        }
    }
`;

module.exports = {
  GET_PARISHES_SCATTER,
  GET_PARISHES_LIST,
  GET_PARISH_BY_DICOFRE,
  GET_PARISH_MAP,
};
