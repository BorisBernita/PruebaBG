import React, { Component } from 'react';
import AddUrl from './AddUrl';


export class Url extends Component {
    state = {
        url: {},
        errorMessage: '',
        newUrl: '',
        bakUrl: ''
    }

    addUrl = (e) => {
        this.setState({errorMessage: '', newUrl: '', bakUrl: '' });
        if (this.state.url && this.state.url.longUrl && this.state.url.longUrl != "") {

        } else {
            this.setState({ errorMessage: 'La Url es requerida' });
            return false;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(this.state.url)
        };
        fetch('/url', requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                if (!response.ok) {
                    const error = (data && data.message) || data || response.status;
                    return Promise.reject(error);
                }
                this.setState({ newUrl: data.shortURL, bakUrl: data.longURL, url: {} });
                this.cancelCourse();
            })
            .catch(error => {
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }

    cancelCourse = () => {
        document.getElementById("create-course-form").reset();
    }

    onChangeForm = (e) => {
        let url = this.state.url
        if (e.target.name === 'longUrl') {
            url.longUrl = e.target.value;
        } 
        this.setState({ url })
    }

    render() {

        return (
            <div className="App">
                <div className="container mrgnbtm">
                    <div className="row">
                        
                        <div className="col-md-8">
                            
                            <AddUrl
                                onChangeForm={this.onChangeForm}
                                AddUrl={this.addUrl}
                            >
                            </AddUrl>
                            <div className="container mt-4">
                            <div className="row">
                                {this.state.newUrl == "" ? "" : <div className="alert alert-success" role="alert">
                                    <a href={this.state.bakUrl} target="_blank"> {this.state.newUrl}</a>
                                </div>}
                                {this.state.errorMessage == "" ? "" : <div className="alert alert-danger" role="alert">
                                    {this.state.errorMessage}
                                </div>}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
