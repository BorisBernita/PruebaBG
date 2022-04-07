import React from 'react'


const AddUrl = ({ onChangeForm, AddUrl }) => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 mrgnbtm">
                    <h2>Convertir URL</h2>
                    <form id="create-course-form">
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label htmlFor="longUrl">Long URL</label>
                                <input type="text" onChange={(e) => onChangeForm(e)} className="form-control" name="longUrl" id="longUrl" aria-describedby="emailHelp" placeholder="Url" required />
                            </div>
                        </div>
                        <button type="button" onClick={(e) => AddUrl()} className="btn btn-danger">Convertir</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddUrl