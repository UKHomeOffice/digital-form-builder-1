import React from 'react'
import { radioGroup, RadioOption } from '../govuk-react-components/radio'
import { icons } from '../icons'
import Flyout from '../flyout'
import AddComponentValue from './add-component-value'
import { InputOptions } from '../govuk-react-components/helpers'
import { clone } from '@xgovformbuilder/model'

function updateComponent (component, modifier, updateModel) {
  modifier(component)
  updateModel(component)
}

function addListValuesTo (component, data, listName) {
  const list = data.lists.find(list => list.name === listName)

  if (list) {
    component.values = {
      type: 'listRef',
      list: listName
    }
    return component
  } else {
    component.values = {
      type: 'listRef'
    }
  }
}

function initialiseStaticValuesFrom (component, data, listName) {
  const list = data.lists.find(list => list.name === listName)

  function itemFrom (item) {
    const newItem = {
      display: item.text,
      value: item.value,
      children: item.conditional?.components ?? []
    }

    Object.assign(newItem, item.description && { hint: item.description })
    Object.assign(newItem, item.condition && { condition: item.condition })

    return newItem
  }

  if (list) {
    component.values = {
      type: 'static',
      valueType: list.type,
      items: list.items.map(itemFrom)
    }
    return component
  } else {
    component.values = {
      type: 'static'
    }
  }
}

export default class ComponentValues extends React.Component {
  constructor (props) {
    super(props)
    const values = props.component.values
    this.state = {
      component: clone(props.component),
      listName: values?.list
    }
  }

  showAddItem = () => this.setState({ showAddItem: true })

  cancelAddItem = () => this.setState({ showAddItem: false })

  showEditItem = (index) => this.setState({ editingItem: index })

  cancelEditItem = () => this.setState({ editingItem: undefined })

  render () {
    const { data, updateModel, page } = this.props
    const { lists } = data
    const { listName, showAddItem, editingIndex, component } = this.state
    const staticValues = data.valuesFor(component)?.toStaticValues()
    const type = component.values?.type

    const listSelectionOnChangeFunctions = {
      listRef: e => {
        updateComponent(component, component => addListValuesTo(component, data, e.target.value), updateModel)
        this.setState({ listName: e.target.value })
      },
      static: e => {
        updateComponent(component, component => initialiseStaticValuesFrom(component, data, e.target.value), updateModel)
        this.setState({ listName: e.target.value })
      }
    }

    return <div>
      {
        radioGroup(
          'definitionType',
          'How would you like to populate the options?',
          [
            new RadioOption('population-type-list',
              'From a list',
              'listRef',
              type === 'listRef',
              this.initialiseValues,
              'Any changes to the list will be reflected in the options presented to users.'
            ),
            new RadioOption(
              'population-type-static',
              'I\'ll populate my own entries',
              'static',
              type === 'static',
              this.initialiseValues,
              'You can still select a list to get you started, but any changes to the list later won\'t be reflected in the options presented to users'
            )
          ],
          new InputOptions(true)
        )
      }

      {type &&
        <div>
          <div className='govuk-form-group'>
            <label className='govuk-label govuk-label--s' htmlFor='field-options-list'>List</label>
            <select
              className='govuk-select govuk-input--width-10' id='field-options-list' name='options.list'
              value={listName} required
              onChange={listSelectionOnChangeFunctions[type]}
            >
              <option/>
              {lists.map(list => {
                return <option key={list.name} value={list.name}>{list.title}</option>
              })}
            </select>
          </div>

          <div>
            <table className='govuk-table'>
              <caption className='govuk-table__caption'>Items</caption>
              <thead className='govuk-table__head'>
                <tr className='govuk-table__row'>
                  <th className='govuk-table__header' scope='col' colSpan='2'></th>
                  <th className='govuk-table__header' scope='col'>
                    {type === 'static' && <a id='add-value-link' className='pull-right' href='#' onClick={this.showAddItem}>Add</a>}
                  </th>
                </tr>
              </thead>
              <tbody className='govuk-table__body'>
                {staticValues && staticValues.items.map((item, index) => (
                  <tr key={`item-row-${index}`} className='govuk-table__row' scope='row'>
                    <td className='govuk-table__cell'>
                      <h2 className='govuk-label'>{item.display}</h2>
                      <div className="govuk-hint"> {item.hint}</div>
                      {item.condition && <p><string>Condition:</string> {item.condition}</p>}
                      <p><string>Children:</string> {item.children.length}</p>
                    </td>
                    <td className='govuk-table__cell'>
                      <a className='list-item-delete' onClick={ () => this.showEditItem(index) }>{icons.edit(false)}</a>
                    </td>
                    <td className='govuk-table__cell'>
                      {type === 'static' &&
                        <a className='list-item-delete' onClick={() => this.removeItem(index)}>&#128465;</a>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Flyout title='Add Item' show={!!showAddItem}
              onHide={this.cancelAddItem}>
              <AddComponentValue
                data={data}
                component={component}
                page={page}
                addItemCallback={this.addItem}
                cancelCallback={this.cancelAddItem}
              />
            </Flyout>
            <Flyout title='Edit Item' show={editingIndex !== undefined}
              onHide={this.cancelEditItem}>
              {/* <AddComponentValue */}
              {/*  data={data} */}
              {/*  component={component} */}
              {/*  page={page} */}
              {/*  addItemCallback={item => updateComponent(component, component => component.items.push(item), updateModel)} */}
              {/*  cancelCallback={this.cancelAddItem} */}
              {/* /> */}
            </Flyout>
          </div>
        </div>
      }
    </div>
  }

  addItem = item => {
    const { component, updateModel } = this.props
    updateComponent(component, component => component.values.items.push(item), updateModel)
  }

  initialiseValues = e => {
    const { component } = this.state
    component.values = {
      type: e.target.value
    }
    this.setState({
      component
    })
  };
}
