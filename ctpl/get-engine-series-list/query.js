let engineSeries =
    "select SERIES_CD, ENGINE_SERIES from EPIM_MC_ENG_SERIES where CAR_COMPANY_CD = ? and MAKE_CD = ?";

module.exports = {
    engineSeries: engineSeries
};
