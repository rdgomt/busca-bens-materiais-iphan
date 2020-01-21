/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'pages/Map.css'
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

// Import leaflet default marker icon properly
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

class Map extends Component {
  componentDidMount() {
    const { geojson } = this.props.inputFile

    const map = new L.map('map', {
      center: [-15.045974, -48.228085],
      zoom: 5,
      maxZoom: 17,
    })

    /* const defaultExtentControl = new L.control.defaultExtent({ position: 'topleft' }).addTo(map) */

    // Tile Layers
    const esriSat = L.tileLayer(ESRI_SAT_LAYER, { attribution: ESRI_SAT_ATTRIBUTION })
    const osm = L.tileLayer(OSM_LAYER, { attribution: OSM_ATTRIBUTION }).addTo(map)
    const osmMinimap = L.tileLayer(OSM_LAYER)

    // Mapa de localização
    new L.Control.MiniMap(osmMinimap, {
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
    }).addTo(map)

    // Controle de camadas
    const layerControl = L.control.layers({
      "OpenStreetMap": osm,
      "Satélite": esriSat,
    }, {}, {
      collapsed: true,
      position: 'topright'
    }).addTo(map)

    // Carrega bens materiais do geoserver do IPHAN
    let inputLayer
    let bensMateriais
    if (geojson && geojson.features !== null) {
      inputLayer = L.geoJSON(geojson, {
        style: {
          color: 'black',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.07,
          fillColor: 'black',
          dashArray: '5, 5',
        }
      }).addTo(map)
      layerControl.addOverlay(inputLayer, 'Camada de entrada')
      const inputLayerBounds = inputLayer.getBounds()
      const bounds = [
        inputLayerBounds._southWest.lng,
        inputLayerBounds._southWest.lat,
        inputLayerBounds._northEast.lng,
        inputLayerBounds._northEast.lat,
      ]

      bensMateriais = L.geoJSON.ajax(`https://cors-anywhere.herokuapp.com/${BENS_MATERIAIS_IPHAN}&CQL_FILTER=BBOX(ponto, ${bounds})`, {
        title: 'Bens Materiais (IPHAN)',
        pointToLayer: (feature, latlng) => {
          /* return L.circleMarker(latlng, this.getStyleForPoints(feature)) */
          return L.marker(latlng, this.getStyleForPoints(feature))
        },
        onEachFeature,
      })

      bensMateriais.on('data:loaded', () => {
        const count = bensMateriais.getLayers().length
        if (count > 0) {
          const markers = L.markerClusterGroup()
          markers.addLayer(bensMateriais)
          map.addLayer(markers)
          layerControl.addOverlay(markers, 'Bens Materiais (IPHAN)')
        }
      })

      map.flyToBounds(inputLayer.getBounds(), { duration: 1 })
    }

    // Função disparada para cada feição no mapa
    function onEachFeature(feature, layer) {
      layer.on({
        click: function (e) {
          window.zoomReference = e.target
        }
      })
      // Conteúdo da popUp ao selecionar feições
      let popupContent = `
        <h3 class="layer-title">Bens Materiais (IPHAN)</h3>
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

    // Centralizar a feição selecionada
    window.zoomToFeature = (f) => {
      map.closePopup()
      if (f.feature.geometry.type === 'Point' || f.feature.geometry.type === 'MultiPoint') {
        map.setView(f.getLatLng(), 17)
      } else {
        map.fitBounds(f.getBounds())
      }
    }

    // Escala
    const graphicScaleControl = L.control.graphicScale({ fill: true }).addTo(map)
    let graphicScaleControlContainer = graphicScaleControl.getContainer()
    graphicScaleControlContainer.style.bottom = '8px'
    graphicScaleControlContainer.style.left = '-10px'

    // Medição
    new L.Control.Measure({
      position: 'topleft',
      primaryLengthUnit: 'meters',
      secondaryLengthUnit: 'kilometers',
      primaryAreaUnit: 'sqmeters',
      secondaryAreaUnit: 'hectares',
      activeColor: '#5E66CC',
      completedColor: '#5E66CC'
    }).addTo(map)

    // Map events
    map.on({
      mousemove: e => {
        // Exibir coordenadas no canto da tela conforme movimento do mouse
        const coordenadasDiv = document.getElementById('coordenadas')
        coordenadasDiv.innerHTML =
          `
            LatLng: ${(e.latlng.lat).toFixed(6)}, ${(e.latlng.lng).toFixed(6)} (WGS84) |
            UTM: ${e.latlng.utm().toString({ decimals: 3, format: '{x}{sep} {y} ({zone}{band})' })}
          `
      }
    })
  }

  getStyleForPoints = feature => {
    switch (feature.properties.codigo_iphan) {
      case 'BA': return { icon: redMarker }
      case 'BI': return { icon: redMarker }
      case 'BM': return { icon: redMarker }
      case 'PS': return { icon: redMarker }
      default: return { icon: redMarker }
    }
  }

  render() {
    return (
      <div id="map">
        <div id="coordenadas" />
      </div>
    )
  }
}

const mapStateToProps = state => ({ inputFile: state.inputFile })
export default connect(mapStateToProps)(Map)

const redMarker = L.ExtraMarkers.icon({
  icon: 'fa-coffee',
  markerColor: 'red',
  shape: 'square',
  prefix: 'fa'
})

const BENS_MATERIAIS_IPHAN = 'http://portal.iphan.gov.br/geoserver/SICG/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SICG:tg_bem_classificacao&outputFormat=application%2Fjson'
const ESRI_SAT_LAYER = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const ESRI_SAT_ATTRIBUTION = 'Imagem de Satélite &copy; <a href="https://www.esri.com">Esri</a>'
const OSM_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTRIBUTION = '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
