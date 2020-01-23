import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import logo from 'assets/img/logo-completa.png'
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
      <a href="https://www.situsarqueologia.com.br/" target="_blank" rel="noopener noreferrer">
        <div className="logo">
          <img src={logo} alt="Situs Arqueologia" height={60} />
        </div>
      </a>
      <div className="dropzone-title">
        <h1>
          Consulta de dados do Patrimônio Cultural Brasileiro
        </h1>
        <h2>
          Inicie importando um arquivo com os limites da área de interesse
        </h2>
      </div>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Clique para selecionar</p>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({ inputFile: state.inputFile })
const mapDispatchToProps = dispatch => bindActionCreators({ load }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Dropzone)

const baseStyle = {
  cursor: 'pointer',
  maxWidth: '500px',
  padding: '25px 50px',
  borderWidth: 2,
  borderRadius: 6,
  borderColor: '#ccc',
  borderStyle: 'dashed',
  backgroundColor: '#fff',
  outline: 'none',
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
