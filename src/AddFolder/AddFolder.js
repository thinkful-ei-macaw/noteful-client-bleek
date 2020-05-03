import React from 'react'
import ValidationError from '../ValidationError'
import ApiContext from '../ApiContext'
import config from '../config'
import PropTypes from 'prop-types';

export default class AddFolder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            formValid: false,
            validationMessages: {
                name: '',
              }
        }
    }

    static contextType = ApiContext;
    static defaultProps ={
      onAddFolder: () => {},
    }

    updateName(name) {
        this.setState({name}, () => {this.validateName(name)});
      }
    
    handleSubmit(event) {
        event.preventDefault();
        // throw new Error('error test'); 
        const name = {
            name: this.state.name
        }
        fetch(`${config.API_ENDPOINT}/folders/`, {
            method: 'POST',
            body: JSON.stringify(name),
            headers: {
                'content-type': 'application/json'
            }    
        })
        .then(res => {
            if (!res.ok)
              return res.json().then(e => Promise.reject(e))
            return res.json()
          })
          .then(data => {
            name.value = ''
            this.context.addFolder(data)
            // allow parent to perform extra behaviour
            this.props.onAddFolder(name)
            this.props.history.push('/')
          })
          .catch(error => {
            throw new TypeError(error);
          })
    }
    
    validateName(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;
    
        fieldValue = fieldValue.trim();
        if(fieldValue.length === 0) {
          fieldErrors.name = 'Name is required';
          hasError = true;
        } else {
          if (fieldValue.length < 3) {
            fieldErrors.name = 'Name must be at least 3 characters long';
            hasError = true;
          } else {
            fieldErrors.name = '';
            hasError = false;
          }
        }
    
        this.setState({
          validationMessages: fieldErrors,
          nameValid: !hasError
        }, this.formValid );
    
      }

    render() {
        return (
            <form className="add_folder" onSubmit={e => this.handleSubmit(e)}>
            <h2>Register</h2>
            <div className="hint">* required field</div>  
            <div className="form-group">
                <label htmlFor="name">Folder Name</label>
                <input type="text" className="folder__control"
                name="name" id="name" onChange={e => this.updateName(e.target.value)}/>
                <button type="submit">Add folder</button>
            </div>
            <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>  
            </form>
        )
    }
}

AddFolder.PropTypes = {
    onAddFolder: PropTypes.func,
}