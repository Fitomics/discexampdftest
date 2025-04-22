function calculatePercentileRankAndCategory() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("IMPORT_AMR"); // Replace YourSheetName with the actual name of your sheet
  const gender = sheet.getRange("AO19").getValue();
  const age = sheet.getRange("AP19").getValue();
  const observedVO2 = sheet.getRange("AQ19").getValue();

  // Find the correct row based on gender and age
  let targetRow = 0;
  for (let row = 19; row <= 34; row++) {
    const rowGender = sheet.getRange(`AS${row}`).getValue();
    const lowerAgeBound = sheet.getRange(`AT${row}`).getValue();
    const upperAgeBound = sheet.getRange(`AU${row}`).getValue();

    if (gender === rowGender && age >= lowerAgeBound && age <= upperAgeBound) {
      targetRow = row;
      break;
    }
  }

  if (targetRow === 0) {
    // No matching row found
    sheet.getRange("AR24").setValue("No matching demographic found for the given age and gender.");
    return;
  }

  // Determine the percentile rank and category based on VO2 max value
  const categories = [
    {bounds: sheet.getRange(`AV${targetRow}:AW${targetRow}`).getValues()[0], percentile: [0.1, 24.9], name: "Low"},
    {bounds: sheet.getRange(`AX${targetRow}:AY${targetRow}`).getValues()[0], percentile: [25, 49.9], name: "Below Average"},
    {bounds: sheet.getRange(`AZ${targetRow}:BA${targetRow}`).getValues()[0], percentile: [50, 74.9], name: "Above Average"},
    {bounds: sheet.getRange(`BB${targetRow}:BC${targetRow}`).getValues()[0], percentile: [75, 97.6], name: "High"},
    {bounds: [sheet.getRange(`BD${targetRow}`).getValue(), Infinity], percentile: [97.7, 100], name: "Elite"}
  ];

  let estimatedPercentile = "Unable to determine percentile";
  let category = "Not Categorized";
  for (const cat of categories) {
    if (observedVO2 >= cat.bounds[0] && observedVO2 <= cat.bounds[1]) {
      category = cat.name; // Determine category name
      if (cat.percentile[1] < 100) { // Linear interpolation for non-Elite categories
        const fractionWithinBounds = (observedVO2 - cat.bounds[0]) / (cat.bounds[1] - cat.bounds[0]);
        estimatedPercentile = cat.percentile[0] + (cat.percentile[1] - cat.percentile[0]) * fractionWithinBounds;
      } else { // For Elite category, treat as the starting percentile
        estimatedPercentile = cat.percentile[0];
      }
      break;
    }
  }

  // Output the category and estimated percentile to cells AR23 and AR24 respectively
  sheet.getRange("AR23").setValue(category); // Set category
  if (typeof estimatedPercentile === "number") {
    sheet.getRange("AR24").setValue(`${estimatedPercentile.toFixed(1)}th Percentile`);
  } else {
    sheet.getRange("AR24").setValue(estimatedPercentile);
  }
}
