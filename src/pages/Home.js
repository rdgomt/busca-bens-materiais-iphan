import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'components/template/Dropzone/Dropzone'
import Header from 'components/template/Header/Header'
import Spinner from 'components/template/Spinner/Spinner'
import MapContainer from 'pages/Map'

const Home = props => {
  const inputFileIsLoading = props.inputFile.loading
  const inputFileGeojson = props.inputFile.geojson
  const intersectDataIsLoading = props.intersectData.loading
  const intersectDataGeojson = props.intersectData.data

  if (inputFileIsLoading || intersectDataIsLoading) {
    return (
      <Spinner />
    )
  }

  if (inputFileGeojson && intersectDataGeojson) {
    return (
      <>
        <Header />
        <MapContainer />
      </>
    )
  }

  return (
    <Dropzone />
  )
}

const mapStateToProps = state => ({
  inputFile: state.inputFile,
  intersectData: state.intersectData,
})
export default connect(mapStateToProps)(Home)
