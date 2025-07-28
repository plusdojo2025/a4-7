import React from 'react';
import { NavLink } from 'react-router-dom';
import './MenuHeader.css'; 

export default class Menu extends React.Component {

    logout = (event) => {
        if (!window.confirm("ログアウトする？")) {
            event.preventDefault();
            return;
        }
    }
    render() {
            return(
            <nav className="menu">
                {/* NavLinkは現在のURLとリンク先を比較して、
                「そのリンクが今表示されているページかどうか」を判断し、
                自動的にactiveクラスを付けてくれる。 */}
                <NavLink to="/schedule" end className="menu-item">
                    ホーム
                </NavLink>
                <NavLink to="/sugoroku" className="menu-item">
                    スゴロク
                </NavLink>
                <NavLink to="/event" className="menu-item">
                    イベント
                </NavLink>
                <NavLink to="/" className="menu-item" onClick={(e)=>this.logout(e)}>
                    ログアウト
                </NavLink>
                {/* <NavLink to="/bookRecommend" className="menu-item">
                    【test】推薦図書
                </NavLink> */}
                

            </nav>
            )
    }
};


