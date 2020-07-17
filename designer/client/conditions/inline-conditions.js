import React from 'react'
import { ConditionsModel } from 'digital-form-builder-model/src/conditions/inline-condition-model'
import InlineConditionsDefinition from './inline-conditions-definition'
import InlineConditionsEdit from './inline-conditions-edit'
import { clone } from 'digital-form-builder-model/src/helpers'
import InlineConditionHelpers from './inline-condition-helpers'

class InlineConditions extends React.Component {
  constructor (props) {
    super(props)

    const { path } = this.props

    this.state = {
      conditions: new ConditionsModel(),
      fields: this.fieldsForPath(path),
      adding: props.hideAddLink
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.path !== prevProps.path) {
      const fields = this.fieldsForPath(this.props.path)

      this.setState({
        conditions: new ConditionsModel(),
        fields: fields,
        editView: false
      })
    }
  }

  fieldsForPath (path) {
    const { data } = this.props
    const inputs = path ? data.inputsAccessibleAt(path) : data.allInputs()
    return inputs
      .map(input => ({
        label: input.displayName,
        name: input.propertyPath,
        type: input.type,
        values: (data.listFor(input)??{}).items
      }))
      .reduce((obj, item) => {
        obj[item.name] = item
        return obj
      }, {})
  }

  onClickAddItem = () => {
    this.setState({
      adding: true
    })
  }

  toggleEdit = () => {
    this.setState({
      editView: !this.state.editView
    })
  }

  onClickCancel = e => {
    const { adding, cancelCallback } = this.props
    this.setState({
      adding: adding,
      conditions: this.state.conditions.clear(),
      editView: false
    })
    if (cancelCallback) {
      cancelCallback(e)
    }
  }

  onClickSave = async () => {
    const { data, conditionsChange } = this.props
    const copy = data.clone()
    const conditionResult = await InlineConditionHelpers.storeConditionIfNecessary(copy, this.state.conditions)
    await data.save(conditionResult.data)
    if (conditionsChange) {
      conditionsChange(conditionResult.condition)
    }
  }

  saveCondition = (condition) => {
    this.setState({
      conditions: this.state.conditions.add(condition)
    })
  }

  editCallback = (conditions) => {
    this.setState({
      conditions: conditions
    })
  }

  onChangeDisplayName = (e) => {
    const input = e.target
    const copy = clone(this.state.conditions)
    copy.name = input.value
    this.setState({
      conditions: copy
    })
  }

  render () {
    const { conditions, adding, editView } = this.state
    const hasConditions = conditions.hasConditions
    const definingCondition = adding || hasConditions

    return (
      this.state.fields && Object.keys(this.state.fields).length > 0 &&
        <div id='inline-conditions'>
          <div id='inline-condition-header'>
            {!definingCondition &&
              <a href='#' id='add-item' className='govuk-link' onClick={this.onClickAddItem}>Add</a>
            }
            {definingCondition &&
              <div>
                <div className='govuk-form-group'>
                  <label className='govuk-label' htmlFor='cond-name'>Display name</label>
                  <input className='govuk-input govuk-input--width-20' id='cond-name' name='cond-name'
                    type='text' defaultValue={conditions.name} required onChange={this.onChangeDisplayName} />
                </div>
                <div className='govuk-form-group'>
                  <label className='govuk-label' id='condition-string-label' htmlFor='condition-string'>When</label>
                </div>
              </div>
            }
            {hasConditions &&
              <div id='conditions-display' className='govuk-body'>
                <div key='condition-string' id='condition-string'>
                  {conditions.toPresentationString()}
                </div>
                {!editView &&
                <div>
                  <a href='#' id='edit-conditions-link' className='govuk-link' onClick={this.toggleEdit}>
                    Not what you meant?
                  </a>
                </div>
                }
              </div>
            }
          </div>
          {!editView && definingCondition &&
            <div>
              <InlineConditionsDefinition expectsCoordinator={hasConditions} fields={this.state.fields}
                saveCallback={this.saveCondition} />
              <div className='govuk-form-group'>
                {hasConditions &&
                  <a href='#' id='save-inline-conditions' className='govuk-button' onClick={this.onClickSave}>Save</a>
                }
                <a href='#' id='cancel-inline-conditions-link' className='govuk-link'
                  onClick={this.onClickCancel}>Cancel</a>
              </div>
            </div>
          }
          {editView && <InlineConditionsEdit conditions={conditions} fields={this.state.fields}
            saveCallback={this.editCallback} exitCallback={this.toggleEdit} />}
        </div>
    )
  }
}

export default InlineConditions
