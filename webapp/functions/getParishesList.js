const { GET_PARISHES_LIST } = require("./utils/queries");
const sendQuery = require("./utils/sendQuery");
const formatResponse = require("./utils/formatResponse");

exports.handler = async (event) => {
  try {
    const res = await sendQuery(GET_PARISHES_LIST);
    const data = res.parishes.data;
    return formatResponse(200, data);
  } catch (err) {
    console.log(err);
    return formatResponse(500, {
      err: "Something went wrong fetching parishes list",
    });
  }
};
