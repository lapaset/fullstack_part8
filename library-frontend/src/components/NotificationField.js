import React from 'react'

const NotificationField = ({ notification }) => {
  return notification
    ? <div style={ {color: 'red'} }>
        {notification}
      </div>
    : null
}

export default NotificationField