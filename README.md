# WABA Bike Infrastructure Map Project
## DCFemTech Hack for Good 2016

### Live Demo
https://dcfemtech.github.io/hackforgood-waba-map/

## Development

This project is managed with npm - you will need to first install Node and NPM. We recommend using the [Node Version Manager (nvm)](https://github.com/creationix/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) to install and manage Node.

Once you've installed Node, to run this project:

1. Clone the repo locally: `git clone https://github.com/dcfemtech/hackforgood-waba-map.git` or `git clone git@github.com:dcfemtech/hackforgood-waba-map.git` depending on your git setup
2. Change into the directory: `cd hackforgood-waba-map`
3. Install dependencies: `npm install`
4. Start the project: `npm start`

## Tests

At the moment there are no tests. Nevertheless, if you run `npm test` this will lint for code style using [eslint](http://eslint.org/).

### Data Sources

| Location | URL | Description |
|----------|-----|-------------|
| Montgomery County, MD | [Bikeways from dataMontgomery](https://data.montgomerycountymd.gov/Transportation/Bikeways/icc2-ppee) | "Separated and marked bike lanes, bike-friendly shoulders, signed and sharrowed on-road routes, paved" |
| Fairfax County, VA | [Bicycle routes from Fairfax GIS Data](http://data.fairfaxcountygis.opendata.arcgis.com/datasets/0dacd6f1e697469a81d6f7292a78d30e_16?geometry=-77.32%2C38.826%2C-77.24%2C38.846) | This is a list of "suggested bike routes" (roads under 35mph) and not true bike lanes so we have excluded this data set from the project. |
| Arlington County, VA | [Bike routes from Arlington County GIS Data](http://gisdata.arlgis.opendata.arcgis.com/datasets/af497e2747104622ac74f4457b3fb73f_4?geometry=-77.295%2C38.81%2C-76.87%2C38.89) | We filtered by "Off Street Trail" and "Marked Route". |
| Alexandria City, VA | [Bike trails from Alexandria Open GIS Data Portal](http://data.alexgis.opendata.arcgis.com/datasets/685dfe61f1aa477f8cbd21dceb5ba9b5_0) | "Collection of trails within the City of Alexandria, Virginia. Shows trail features categorized by on street, off street, and sharrow (bike lane marked)." |
| Prince George's County, MD | [Master Plan Trails from PG Planning Open Data Portal](http://gisdata.pgplanning.org/opendata/) | Filtered by FACILITY_S = "Existing" AND "FACILITY_T = "Bike Lane" OR "FACILITY_T" = "Hard Surface Trail" so as to include only facilities that have been built (not just planned) and only bike lanes and paved trails. |
