import React from 'react'
import { Link } from 'react-router-dom'
import 'components/template/Header/Header.css'
import logo from 'assets/img/logo-completa.png'

export default () => (
  <div id="header">
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <div className="logo">
        <a href="https://www.situsarqueologia.com.br/" target="_blank" rel="noopener noreferrer">
          <img src={logo} alt="Situs Arqueologia" height={30} />
        </a>
      </div>
      <div>
        <text style={{ fontWeight: 400, fontSize: 14 }}>
          Patrimônio Cultural
        </text>
      </div>
    </div>

    <button className="button" type="button" onClick={() => window.location.reload()}>
      Nova consulta
    </button>
  </div>
)
