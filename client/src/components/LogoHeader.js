import React from 'react';

import './LogoHeader.css';

export default class LogoHeader extends React.Component {
    render() {
        return (
            <div className='logo-container'><img src="logo.png" style={{ width: '400px' }}/></div>
        )
    }
}