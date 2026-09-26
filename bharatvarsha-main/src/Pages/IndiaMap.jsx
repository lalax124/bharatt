import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import "./IndiaMap.css";

const GEO_URL = "/india-states.json";

const slugify = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function IndiaMap() {
  const navigate = useNavigate();
  const { state: stateParam } = useParams();
  const [geoData, setGeoData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [availableStates, setAvailableStates] = useState([]);

  useEffect(() => {
    fetch(GEO_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load India map data");
        return response.json();
      })
      .then(setGeoData)
      .catch((error) => console.error("GeoJSON error:", error));

    fetch("/api/states")
      .then((response) => (response.ok ? response.json() : []))
      .then(setAvailableStates)
      .catch(() => setAvailableStates([]));
  }, []);

  const stateBySlug = useMemo(() => {
    const result = {};
    availableStates.forEach((item) => {
      result[item.id] = item;
      result[slugify(item.name)] = item;
    });
    return result;
  }, [availableStates]);

  useEffect(() => {
    if (!geoData || !stateParam) {
      if (!stateParam) setSelectedState(null);
      return;
    }

    const matchingGeo = geoData.features?.find(
      (geo) => slugify(geo.properties?.NAME_1) === stateParam.toLowerCase()
    );

    if (matchingGeo) {
      const name = matchingGeo.properties?.NAME_1 || "Unknown State";
      const apiState = stateBySlug[stateParam.toLowerCase()] || stateBySlug[slugify(name)];

      setSelectedState({
        name,
        slug: slugify(name),
        type: matchingGeo.properties?.ENGTYPE_1 || "State",
        code: matchingGeo.properties?.HASC_1 || "",
        hasData: Boolean(apiState),
      });
    }
  }, [geoData, stateParam, stateBySlug]);

  const handleStateClick = (geo) => {
    const name = geo.properties?.NAME_1 || "Unknown State";
    const slug = slugify(name);
    navigate(`/map/${slug}`);
  };

  const clearSelection = () => navigate("/map");

  return (
    <section className="india-section">
      <div className="india-heading">
        <div>
          <span className="section-label">DISCOVER INDIA</span>
          <h1>
            A civilization of
            <br />
            <em>living traditions</em>
          </h1>
          <p>
            Explore the people, places, crafts and traditions that continue to
            shape India's cultural identity.
          </p>
        </div>

        <div className="explore-number">
          <span>01</span>
          <small>
            SELECT A STATE
            <br />
            TO EXPLORE
          </small>
        </div>
      </div>

      <div className="india-content">
        <div className="map-wrapper">
          {!geoData && <div className="map-loading">Loading India...</div>}

          {geoData && (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1050, center: [82, 22] }}
              className="india-svg"
              width={900}
              height={650}
            >
              <Geographies geography={geoData}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties?.NAME_1 || "";
                    const isSelected = selectedState?.name === name;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleStateClick(geo)}
                        className={`india-state ${isSelected ? "selected-state" : ""}`}
                        aria-label={name}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          )}

          {!selectedState && geoData && (
            <div className="map-instruction">
              <span>EXPLORE</span>
              <h2>India</h2>
              <p>Click any state to discover →</p>
            </div>
          )}
        </div>

        <aside className="state-panel">
          {selectedState ? (
            <>
              <button className="close-button" onClick={clearSelection} aria-label="Close state">
                ×
              </button>

              <span className="panel-label">HERITAGE REGION</span>
              <h2>{selectedState.name}</h2>
              <span className="country-name">INDIA</span>
              <div className="panel-line"></div>

              <h3>
                A living cultural
                <br />
                tradition
              </h3>

              <p>
                {selectedState.hasData
                  ? `Explore the heritage, traditions, food, crafts, festivals and cultural stories of ${selectedState.name}.`
                  : "This map region is available, but detailed cultural data has not yet been added to the project dataset."}
              </p>

              <span className="panel-label">CULTURAL HERITAGE</span>

              {selectedState.hasData ? (
                <button
                  className="explore-button"
                  onClick={() => navigate(`/ai-guide?state=${selectedState.slug}`)}
                >
                  EXPLORE {selectedState.name.toUpperCase()}
                  <span>↗</span>
                </button>
              ) : (
                <button className="explore-button" onClick={clearSelection}>
                  BACK TO MAP
                  <span>↗</span>
                </button>
              )}
            </>
          ) : (
            <>
              <span className="panel-label">HERITAGE REGION</span>
              <h2>India</h2>
              <span className="country-name">28 STATES</span>
              <div className="panel-line"></div>
              <h3>
                A civilization of
                <br />
                living traditions
              </h3>
              <p>
                Select a state on the map to explore its heritage, crafts,
                traditions and cultural identity.
              </p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

export default IndiaMap;
