import React from 'react'
import { SortableContainer, SortableElement, arrayMove, SortableHandle } from 'react-sortable-hoc'
import { clone } from '@xgovformbuilder/model'
import { withI18n } from '../i18n'
import { RenderInPortal } from '../components/render-in-portal'
import Flyout from '../flyout'
import ListItemEdit from './list-item-edit'

function headDuplicate (arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] === arr[i]) {
        return j
      }
    }
  }
}

const DragHandle = SortableHandle(() => <span className='drag-handle-list'>&#9776;</span>)

const SortableItem = SortableElement(({ index, item, type, conditions, removeItem }) => {
  return (<tr className='govuk-table__row' scope='row'>
    <td className='govuk-table__cell'>
      <DragHandle />
    </td>
    <td className='govuk-table__cell'>
      {item}
    </td>
    <td className='govuk-table__cell'>
      edit
    </td>
    <td className='govuk-table__cell' width='20px'>
      <a className='list-item-delete' onClick={() => removeItem(index)}>&#128465;</a>
    </td>
  </tr>)
}
)

const SortableList = SortableContainer(({ items, conditions, type, removeItem }) => {
  return (
    <tbody className='govuk-table__body'>
      {items.map((item, index) => (
        <SortableItem key={`item-${index}`} item={item} index={index} conditions={conditions} type={type} removeItem={removeItem} />
      ))}
    </tbody>
  )
})

class ListItems extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      items: clone(props.items) || []
    }
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex)
    }))
  };

  onClickAddItem = e => {
    e.preventDefault()
  }

  removeItem = idx => {
    this.setState({
      items: this.state.items.filter((s, i) => i !== idx)
    })
  }

  onClickDelete = e => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { data, list } = this.props
    const copy = clone(data)

    // Remove the list
    copy.lists.splice(data.lists.indexOf(list), 1)

    // Update any references to the list
    copy.pages.forEach(p => {
      if (p.list === list.name) {
        delete p.list
      }
    })

    data.save(copy)
      .then(data => {
        console.log(data)
        this.props.onEdit({ data })
      })
      .catch(err => {
        console.error(err)
      })
  }

  onCreateClick = (e) => {
    e.preventDefault()
    this.setState({ isEditingListItem: true })
  }

  render () {
    const { items, isEditingListItem, selectedListItem } = this.state
    const { type, conditions, i18n, data } = this.props

    return (
      <div>
        <table className='govuk-table'>
          <thead className='govuk-table__head'>
            <tr className='govuk-table__row'>
              <th className='govuk-table__header' scope='col'/>
              <th className='govuk-table__header' scope='col'/>
              <th className='govuk-table__header' scope='col'/>
            </tr>
          </thead>
          <SortableList
            type={type} items={items || []} conditions={conditions} removeItem={this.removeItem}
            onBlur={this.onBlur} onSortEnd={this.onSortEnd}
            helperClass='dragging' lockToContainerEdges useDragHandle
          />
        </table>
        <a className="govuk-link" href="#" onClick={this.onCreateClick}>{i18n('list.createListItem')}</a>
        {isEditingListItem &&
          <RenderInPortal>
            <Flyout title='Add Item' show={isEditingListItem} width={'xlarge'}
              onHide={this.cancelAddItem}>
              <ListItemEdit data={data} conditions={conditions}/>
            </Flyout>
          </RenderInPortal>
        }
      </div>

    )
  }
}

export default withI18n(ListItems)
