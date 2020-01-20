import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dropzone from 'components/template/Dropzone/Dropzone'
import MapContainer from 'pages/Map'

const Home = props => {
  const { geojson } = props.inputFile

  return (
    geojson ? <MapContainer /> : <Dropzone />
  )
}

const mapStateToProps = state => ({ inputFile: state.inputFile })
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Home)
