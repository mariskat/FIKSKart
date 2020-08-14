/** file fetchmapData.js
 *  Sending and creating queries for fetching data from OpenNGIS API
 *  Authors: Thea Tokstad and Marie Skatvedt
 */

/** Sendsg query for fetching all datasets from NGIS-OpenAPI
 *  returns all datasets from API
 */
export async function getDatasets() {
  let responseDatasets = await fetch(
    "https://qmsrest.westeurope.cloudapp.azure.com:8080/v1/datasets",
    {
      headers: {
        Authorization: "Basic " + API_KEY,
      },
    }
  );
  return responseDatasets.json();
}

/** Sends query for fetching data from bboxarea from dataset with datasetID=datasetUID from NGIS-OpenAPI
 *  param bbox - bbox area defined by Leaflet map area
 *  returns all vector data from API within the bbox area from the dataset
 */
export async function getData(bbox) {
  let datasetUID = "1eb5a249-c7c5-4328-9a7f-9c6d1ce6d526";
  let response = await fetch(
    "https://qmsrest.westeurope.cloudapp.azure.com:8080/v1/datasets/" +
    datasetUID +
    "/features?crs_EPSG=5942&bbox=" +
    bbox +
    "&references=none",
    {
      headers: {
        Authorization: "Basic " + API_KEY,
        Accept: " application/vnd.kartverket.sosi+json; crs_EPSG=5942",
      },
    }
  );

  return response.json();
}
