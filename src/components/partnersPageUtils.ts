import { navigate } from "@reach/router";
import type { WindowLocation } from "@reach/router";

export const partnersRoute = "partners";
const partnerQueryParamName = "partner";

export const getSelectedPartner = (
  routerLocation: WindowLocation
): string | undefined => {
  const searchParams = new URLSearchParams(routerLocation.search);
  const queryValue = searchParams.get(partnerQueryParamName);
  const selectedPartner = queryValue === null ? undefined : queryValue;
  return selectedPartner;
};

export const getPartnerPath = (selectedPartner: string | undefined) =>
  `/${partnersRoute}/${
    selectedPartner === undefined
      ? ""
      : `?${partnerQueryParamName}=${selectedPartner}`
  }`;

export const setSelectedPartner = (selectedPartner: string | undefined) => {
  const path = getPartnerPath(selectedPartner);
  navigate(path);
};
