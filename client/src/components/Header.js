import Menu from '../components/MenuHeader';
import TaskHeader from '../components/TaskHeader';
import TriviaHeader from '../components/TriviaHeader';
import LogoHeader from '../components/LogoHeader';
import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // DBから取得するデータ
            vacations: [], 
            privateSchedules: [],
            columns: [],
            hwSchedules: [],
            backgroundUrl: '',

            // UIの状態
            showModal: false,
            selectedHwContents: [],
            selectedHwDate: '',
            dragData: null, 
            selectedVacationIdx: 0,
            showModalDecide: false,
            modalData: [],

            // その他
            today: "2025-07-25",
            userId: localStorage.getItem('userId') || ""
        };
    }
    render(){
        return (
            <div>
                <ul id='header'>
                    <li><TriviaHeader/></li>
                    <li><LogoHeader/></li>
                    <li>
                        <TaskHeader                  
                        />
                    </li>
                </ul>
                <Menu></Menu>
            </div>
        )
    }
}

export default Header