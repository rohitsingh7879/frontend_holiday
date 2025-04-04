import moment from "moment";

const generateCruiseDetailsUrl = (endpoint, item, item2) => {
  if (!item) return "";

  // Format the ID, name, region, cruise nights, check-in date, and ref
  const formattedItemName =
    item?.name?.replace(/\s+/g, "-").toLowerCase() ||
    item2?.name?.replace(/\s+/g, "-").toLowerCase();

  const formattedRegion =
    item?.region?.replace(/\s+/g, "-").toLowerCase() ||
    item2?.region?.replace(/\s+/g, "-").toLowerCase();

  const formattedShipName =
    item?.shipname?.replace(/\s+/g, "-").toLowerCase() ||
    item2?.shipname?.replace(/\s+/g, "-").toLowerCase() ||
    item?.ship_title?.replace(/\s+/g, "-").toLowerCase() ||
    item2?.ship_title?.replace(/\s+/g, "-").toLowerCase() ||
    item?.ship?.replace(/\s+/g, "-").toLowerCase() ||
    item2?.ship?.replace(/\s+/g, "-").toLowerCase() 

  const formattedCruiseNights =
    item?.cruise_nights || item?.night || item2?.cruise_nights;

  // Format check-in date if valid
  const formattedCheckInDate = moment
    .unix(
      item?.itinerary?.[0]?.check_in_date ||
        item?.date ||
        item2?.date ||
        item2?.itinerary?.[0]?.check_in_date
    )
    .isValid()
    ? moment
        .unix(
          item?.itinerary?.[0]?.check_in_date ||
            item?.date ||
            item2?.date ||
            item2?.itinerary?.[0]?.check_in_date
        )
        .format("YYYY-MM-DD")
    : "";

  const formattedDate = moment(item?.date || item2?.date).isValid()
    ? moment(item?.date || item2?.date).format("YYYY-MM-DD")
    : "";

  const formattedRef =
    item?.reference || item?.ref || item2?.reference || item2?.ref;

  const formattedId =
    item?._id?.replace(/\s+/g, "-").toLowerCase() ||
    item?.id?.replace(/\s+/g, "-").toLowerCase();

  // Return the final formatted URL
  return `/${endpoint}/${formattedItemName}_${
    formattedShipName || formattedRegion
  }_${formattedCruiseNights}_nights_${formattedCheckInDate || formattedDate}_${formattedRef}_${
    formattedId ? formattedId : ""
  }`;
};

export default generateCruiseDetailsUrl;
