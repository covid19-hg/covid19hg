export const fetchJSON = async <Data>(url: string): Promise<Data> => {
  // Note: need to `include` credentials in requests to the server hosting the static JSON files
  // so that the `Authorization` field is included in the request.
  // Otherwise, the request will be denied because of password protection.
  // On the other hand, `credentials` is not needed for requests to the regular data API. In fact, if we
  // force `credentials` to be `include`d, the requests will fail because of
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
  const response = await fetch(url);
  if (response.ok) {
    return await response.json();
  } else {
    throw response.statusText;
  }
};
