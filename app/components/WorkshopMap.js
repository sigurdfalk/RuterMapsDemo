import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import MapView from 'react-native-maps';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as stopsActions from '../actions/stopsActions'
import { WorkshopXYToLatLon } from '../utils/geoutils'
import { calculateMinMaxUrl } from '../utils/maputils'

const LATITUDE = 59.927954;
const LONGITUDE = 10.724344;

const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;


class WorkshopMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
    }

    this.fetchStops = this.fetchStops.bind(this)
    this.onRegionChange = this.onRegionChange.bind(this)
  }

  componentDidMount(){
    this.fetchStops(LATITUDE, LONGITUDE, LATITUDE_DELTA, LONGITUDE_DELTA)
    /*

    AUTO ADJUST TO USERS CURRENT POSITION.

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        });
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      const newRegion = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }

    });
    */
    this.onRegionChange({
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          });
  }
/*
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

*/
  onRegionChange(region) {
    console.log('in change ' + region.latitude)
    this.setState({ region });
  }

  onZoomOut(){
    const { region } = this.state


    this.map.animateToRegion({
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta/2,
      longitudeDelta: region.longitudeDelta/2
    })

  }

  render() {
    let { stops } = this.props
    let { region } = this.state

    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          ref={ref => { this.map = ref }}
          style={styles.map}
          region = {this.state.region}
          onRegionChange = { this.onRegionChange }
          onRegionChangeComplete={(region) => {
              this.fetchStops(region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta)
              this.onRegionChange(region)
            }
          }
        >
          {stops.map(stop => (
              <MapView.Marker
                key={stop.ID}
                coordinate={WorkshopXYToLatLon(stop.X, stop.Y)}
                title={stop.Name}
                description={stop.Lines.map((line) => ' ' + line.Name).toString()}
              />
          ))}
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.map.animateToRegion({
                  latitude: region.latitude,
                  longitude: region.longitude,
                  latitudeDelta: region.latitudeDelta/2,
                  longitudeDelta: region.longitudeDelta/2
                }, 800)}
            style={[styles.bubble, styles.button]}
          >
            <Text>In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.map.animateToRegion({
                  latitude: region.latitude,
                  longitude: region.longitude,
                  latitudeDelta: region.latitudeDelta*2,
                  longitudeDelta: region.longitudeDelta*2
                }, 800)}
            style={[styles.bubble, styles.button]}
          >
            <Text>Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  fetchStops(latitude, longitude, latitudeDelta, longitudeDelta) {
    const { actions } = this.props

    let stops = fetch(calculateMinMaxUrl(latitude, longitude, latitudeDelta, longitudeDelta))
      .then((res) => res.json())
      .then((stops) => actions.setStops(stops))
      .catch((err) => console.log(err))
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    marginTop: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default connect(state => ({
    stops: state.stops
  }),
  (dispatch) => ({
    actions: bindActionCreators(stopsActions, dispatch)
  })
)(WorkshopMap);
