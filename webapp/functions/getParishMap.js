const { GET_PARISH_MAP } = require("./utils/queries");
const sendQuery = require("./utils/sendQuery");
const formatResponse = require("./utils/formatResponse");

exports.handler = async (event) => {
  const { dicofre } = JSON.parse(event.body);
  const variables = { dicofre };

  try {
    const res = await sendQuery(GET_PARISH_MAP, variables);
    let parsedResponse = res.parish;
    parsedResponse.results = JSON.parse(parsedResponse.results);
    return formatResponse(200, parsedResponse);
  } catch (err) {
    console.log(err);
    return formatResponse(500, {
      err: `Something went wrong fetching map data for ${dicofre}`,
    });
  }
};
