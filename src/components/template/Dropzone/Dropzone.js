import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useDropzone } from 'react-dropzone'
import { load } from 'store/ducks/inputFile'
import 'components/template/Dropzone/Dropzone.css'

const Dropzone = props => {
  const { load } = props

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    multiple: false,
    accept: '.kml, application/vnd.google-earth.kml+xml',
    onDrop: files => load(files),
  })

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  }), [isDragActive, isDragAccept, isDragReject])

  return (
    <div className="dropzone">
      <div className="dropzone-title">
        <h1>
          Consulta de Bens Materiais cadastrados no IPHAN
        </h1>
        <h2>
          Importe um arquivo KML com os limites do empreendimento
        </h2>
      </div>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Clique para selecionar ou arraste um arquivo KML</p>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({ inputFile: state.inputFile })
const mapDispatchToProps = dispatch => bindActionCreators({ load }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Dropzone)

const baseStyle = {
  cursor: 'pointer',
  width: '500px',
  padding: '25px 50px',
  borderWidth: 2,
  borderRadius: 6,
  borderColor: '#ccc',
  borderStyle: 'dashed',
  backgroundColor: '#fff',
  outline: 'none',
  boxShadow: '1px 1px 10px #00000015',
  transition: 'border .24s ease-in-out',
}

const activeStyle = {
  borderColor: 'blue',
}

const acceptStyle = {
  borderColor: 'green',
}

const rejectStyle = {
  borderColor: 'red',
}
