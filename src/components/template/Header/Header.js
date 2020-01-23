import React from 'react'
import { Link } from 'react-router-dom'
import 'components/template/Header/Header.css'
import logo from 'assets/img/logo.png'

export default () => (
  <div id="header">
    <Link to="/">
      <div className="logo">
        <img src={logo} alt="Situs Arqueologia" height={20} />
      </div>
    </Link>
    <div className="title-center">
      <text style={{ fontWeight: 500, fontSize: 14 }}>
        Patrimônio Cultural Brasileiro
      </text>
    </div>
    <div />
    <button className="button" type="button" onClick={() => window.location.reload()}>
      Nova consulta
    </button>
  </div>
)
