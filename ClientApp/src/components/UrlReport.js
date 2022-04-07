import React, { Component } from 'react';

export class UrlReport extends Component {
    static displayName = UrlReport.name;

  constructor(props) {
      super(props);
      this.state = { urls: [], loading: true };
  }

    componentDidMount() {
        this.getReport();
    }



  static renderReportTable(urls) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Id</th>
            <th>URL Base</th>
            <th>URL Corta</th>
            <th>Fecha</th>
          </tr>
        </thead>
            <tbody>
                {urls.map(url =>
              <tr key={url.id}>
                  <td>{url.id}</td>
                        <td>{url.longUrl}</td>
                        <td><a href={url.longUrl} target="_blank">http://{url.segment}</a></td>
                        <td>{new Intl.DateTimeFormat('es-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(url.added))}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
    }



  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : UrlReport.renderReportTable(this.state.urls);

    return (
      <div>
        <h1 id="tabelLabel" >Reporte de URL's generadas</h1>
        <p>Lista de ULR's generadas</p>
        {contents}
      </div>
    );
    }


  async getReport() {
    const response = await fetch('url');
    const data = await response.json();
    this.setState({ urls: data, loading: false });
    }


}
