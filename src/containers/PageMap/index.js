import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';

import getLabel from 'utils/get-label';

import { selectSites } from 'containers/App/selectors';
import { MAPBOX_TOKEN } from 'containers/App/constants';

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

const key = 'map';

mapboxgl.accessToken = MAPBOX_TOKEN;

class PageMap extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/satellite-v9',
    });
  }
  componentDidUpdate() {
    const { sites } = this.props;

    const bounds = new mapboxgl.LngLatBounds();

    sites.forEach((site) => {
      const coordinates = [parseFloat(site.get('lon')), parseFloat(site.get('lat'))];
      new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(this.map);
      bounds.extend(coordinates);
    });

    this.map.fitBounds(bounds, {
      padding: 80,
    });
  }
  componentWillUnmount() {
    this.map.remove();
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>{getLabel(`component.${key}.title`)}</title>
          <meta
            name="description"
            content={getLabel(`component.${key}.metaDescription`)}
          />
        </Helmet>
        <MapContainer innerRef={(el) => { this.mapContainer = el; }} />
      </div>
    );
  }
}

PageMap.propTypes = {
  sites: PropTypes.object,
};

const mapStateToProps = (state) => ({
  sites: selectSites(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PageMap);
