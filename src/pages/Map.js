/* eslint-disable */

// TODO:
// - refactor variables and functions attached to window

import React, { Component } from 'react'
import { connect } from 'react-redux'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-ajax'
import 'leaflet-measure/dist/leaflet-measure.pt_BR'
import 'leaflet-measure/dist/leaflet-measure.css'
import 'leaflet.defaultextent/dist/leaflet.defaultextent'
import 'leaflet.defaultextent/dist/leaflet.defaultextent.css'
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min'
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css'
import 'leaflet.utm'
import 'leaflet-minimap/dist/Control.MiniMap.min'
import 'leaflet-minimap/dist/Control.MiniMap.min.css'
import 'leaflet-hash'
import 'leaflet.markercluster/dist/leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet-extra-markers/dist/js/leaflet.extra-markers.min'
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css'
import 'leaflet-contextmenu/dist/leaflet.contextmenu.min'
import 'leaflet-contextmenu/dist/leaflet.contextmenu.min.css'
import 'pages/Map.css'

class Map extends Component {
  componentDidMount() {
    const { geojson } = this.props.inputFile
    const { data } = this.props.intersectData

    const showCoordinates = (e) => {
      alert(
        `LatLng: ${(e.latlng.lat).toFixed(6)}, ${(e.latlng.lng).toFixed(6)} (WGS84)\nUTM: ${e.latlng.utm().toString({ decimals: 3, format: '{x}{sep} {y} ({zone}{band})' })}`
      )
    }

    const centerMap = (e) => {
      map.panTo(e.latlng)
    }

    const map = new L.map('map', {
      ...MAP_OPTIONS,
      contextmenu: true,
      contextmenuWidth: 140,
      contextmenuItems: [{
        text: 'Mostrar coordenadas',
        callback: showCoordinates
      }, {
        text: 'Centralizar mapa',
        callback: centerMap
      }],
    })

    OSM_LAYER.addTo(map)

    map.addLayer(BENS_MATERIAIS_CLUSTER)
    map.addLayer(BENS_IMATERIAIS_CLUSTER)

    const inputLayer = L.geoJSON(geojson, { style: INPUT_LAYER_STYLE }).addTo(map)
    LAYERS_CONTROL.addOverlay(inputLayer, 'Camada de entrada')
    map.flyToBounds(inputLayer.getBounds(), { duration: 1 })

    const bensMateriais = L.geoJSON(data.bensMateriais, {
      title: 'Bens Materiais (IPHAN)',
      pointToLayer: (feature, latlng) => L.marker(latlng, this.getStyleForBensMateriais(feature)),
      onEachFeature: this.onEachFeature,
    })
    BENS_MATERIAIS_CLUSTER.addLayer(bensMateriais)
    LAYERS_CONTROL.addOverlay(BENS_MATERIAIS_CLUSTER, 'Bens Materiais (IPHAN)')

    const bensImateriais = L.geoJSON(data.bensImateriais.points, {
      title: 'Bens Imateriais (IPHAN)',
      pointToLayer: (feature, latlng) => L.marker(latlng, { icon: GREEN_MARKER }),
      onEachFeature: this.onEachFeature,
    })
    BENS_IMATERIAIS_CLUSTER.addLayer(bensImateriais)
    LAYERS_CONTROL.addOverlay(BENS_IMATERIAIS_CLUSTER, 'Bens Imateriais (IPHAN)')

    LAYERS_CONTROL.addTo(map)
    ZOOM_CONTROL.addTo(map)
    MINIMAP_CONTROL.addTo(map)
    MEASURE_CONTROL.addTo(map)
    GRAPHIC_SCALE_CONTROL.addTo(map)
    let graphicScaleControlContainer = GRAPHIC_SCALE_CONTROL.getContainer()
    graphicScaleControlContainer.style.bottom = '8px'
    graphicScaleControlContainer.style.left = '-10px'

    map.on({
      mousemove: e => {
        const coordenadasDiv = document.getElementById('coordenadas')
        coordenadasDiv.innerHTML =
          `
            LatLng: ${(e.latlng.lat).toFixed(6)}, ${(e.latlng.lng).toFixed(6)} (WGS84) |
            UTM: ${e.latlng.utm().toString({ decimals: 3, format: '{x}{sep} {y} ({zone}{band})' })}
          `
      }
    })

    window.zoomToFeature = (f) => {
      map.closePopup()
      if (f.feature.geometry.type === 'Point' || f.feature.geometry.type === 'MultiPoint') {
        map.setView(f.getLatLng(), 17)
      } else {
        map.fitBounds(f.getBounds())
      }
    }
  }

  getStyleForBensMateriais = feature => {
    switch (feature.properties.codigo_iphan) {
      case 'BA': return { icon: RED_MARKER }
      case 'BI': return { icon: ORANGE_MARKER }
      case 'BM': return { icon: BLUE_MARKER }
      case 'PS': return { icon: VIOLET_MARKER }
      default: return { icon: RED_MARKER }
    }
  }

  onEachFeature = (feature, layer) => {
    layer.on({
      click: function (e) {
        window.zoomReference = e.target
      }
    })

    // Conteúdo da popUp ao selecionar feições
    let popupContent = `
      <h3 class="layer-title">Patrimônio Cultural (IPHAN)</h3>
      <div class="leaflet-popup-container">
        <table class="layer-table">
    `
    let i
    for (i in feature.properties) {
      if (i !== 'id') {
        popupContent +=
          `
            <tr class="layer-table">
              <th class="layer-table">${i}</th>
              <td class="layer-table">
                ${feature.properties[i] === null ? '' : feature.properties[i]}
              </td>
            </tr>
          `
      }
    }
    popupContent +=
      `
        </table>
        </br><a href="#" onclick="zoomToFeature(zoomReference)">Aproximar</a>
        </div>
      `
    layer.bindPopup(popupContent)
  }

  render() {
    return (
      <div id="map">
        <div id="coordenadas" />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  inputFile: state.inputFile,
  intersectData: state.intersectData,
})
export default connect(mapStateToProps)(Map)

const MAP_OPTIONS = {
  center: [-16, -48],
  zoom: 5,
  maxZoom: 17,
  zoomControl: false
}
const INPUT_LAYER_STYLE = {
  color: 'black',
  weight: 2,
  opacity: 1,
  fillOpacity: 0.07,
  fillColor: 'black',
  dashArray: '5, 5',
}
const MARKERS_SHAPE = { shape: 'square' }
const RED_MARKER = L.ExtraMarkers.icon({ ...MARKERS_SHAPE, markerColor: 'red' })
const ORANGE_MARKER = L.ExtraMarkers.icon({ ...MARKERS_SHAPE, markerColor: 'orange' })
const BLUE_MARKER = L.ExtraMarkers.icon({ ...MARKERS_SHAPE, markerColor: 'blue' })
const VIOLET_MARKER = L.ExtraMarkers.icon({ ...MARKERS_SHAPE, markerColor: 'violet' })
const GREEN_MARKER = L.ExtraMarkers.icon({ ...MARKERS_SHAPE, markerColor: 'green' })
const BENS_MATERIAIS_CLUSTER = L.markerClusterGroup()
const BENS_IMATERIAIS_CLUSTER = L.markerClusterGroup()
const ESRI_SAT_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const ESRI_SAT_ATTRIBUTION = 'Imagem de Satélite &copy; <a href="https://www.esri.com">Esri</a>'
const ESRI_SAT_LAYER = L.tileLayer(ESRI_SAT_URL, { attribution: ESRI_SAT_ATTRIBUTION })
const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTRIBUTION = '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const OSM_LAYER = L.tileLayer(OSM_URL, { attribution: OSM_ATTRIBUTION })
const OSM_LAYER_MINIMAP = L.tileLayer(OSM_URL)
const LAYERS_CONTROL = L.control.layers({
  "OpenStreetMap": OSM_LAYER,
  "Satélite": ESRI_SAT_LAYER,
}, {}, { collapsed: true, position: 'topright' })
const ZOOM_CONTROL = L.control.zoom({ position: 'topright' })
const MINIMAP_CONTROL = new L.Control.MiniMap(OSM_LAYER_MINIMAP, {
  width: 125,
  height: 125,
  collapsedWidth: 20,
  collapsedHeight: 20,
  zoomLevelOffset: -6,
  toggleDisplay: true,
  autoToggleDisplay: true,
  strings: {
    hideText: 'Ocultar mapa de localização',
    showText: 'Mostrar mapa de localização'
  },
})
const MEASURE_CONTROL = new L.Control.Measure({
  position: 'topright',
  primaryLengthUnit: 'meters',
  secondaryLengthUnit: 'kilometers',
  primaryAreaUnit: 'sqmeters',
  secondaryAreaUnit: 'hectares',
  activeColor: '#5E66CC',
  completedColor: '#5E66CC'
})
const GRAPHIC_SCALE_CONTROL = L.control.graphicScale({ fill: true })
