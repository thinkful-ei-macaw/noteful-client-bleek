import React from 'react'
import ValidationError from '../ValidationError'
import ApiContext from '../ApiContext'
import config from '../config'
import PropTypes from 'prop-types';

export default class AddNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          name: '',
          content: '',
          folder: '',
          formValid: false,
            validationMessages: {
                name: '',
                content: '',
                folder: ''
              }
        }

    }
   
    static defaultProps ={
        onAddNote: () => {},
      }
    updateName(name) {
        this.setState({name}, () => {this.validateName(name)});
      }
    updateContent(content) {
      this.setState({content}, () => {this.validateContent(content)});
    }
    updateFolder(folder) {
      console.log(folder)
      this.setState({folder}, () => folder);
    }
    
    handleSubmit(event) {
        event.preventDefault();        
        const note = {
          name: this.state.name,
          content: this.state.content,
          modified: new Date(),
          folderId: event.target[`folder-select`].value,
        }
        fetch(`${config.API_ENDPOINT}/notes/`, {
            method: 'POST',
            body: JSON.stringify(note),
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
            this.context.addNote(data)
            this.props.history.push(`/folder/${data.folderId}`)
          })
          .catch(error => {
            // getDerivedStateFromError({ error })
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

      validateContent(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;
    
        fieldValue = fieldValue.trim();
        if(fieldValue.length === 0) {
          fieldErrors.name = 'Content is required';
          hasError = true;
        } else {
          if (fieldValue.length < 3) {
            fieldErrors.name = 'Content must be at least 3 characters long';
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

      static contextType = ApiContext;

    render() {
      const folders = this.context.folders;
        return (
          <form className="add_note" onSubmit={e => this.handleSubmit(e)}>
          <h2>Register</h2>
          <div className="hint">* required field</div>  
          <div className="name-group">
          <label htmlFor="name">Note Name</label>
              <input type="text" className="note__control"
              name="name" id="name" onChange={e => this.updateName(e.target.value)}/>
              <label htmlFor="content">Note Content</label>
              <textarea
              name="note-content" id="content" onChange={e => this.updateContent(e.target.value)}/>
              <select name='folder-select' id='folder-select'>
                {folders.map(folder => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
              </select>
              <button type="submit">Add note</button>
          </div>
          <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>  
          </form>
        )
    }
}

AddNote.PropTypes = {
  onAddNote: PropTypes.func
}