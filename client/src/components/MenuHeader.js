import React from 'react';
import { NavLink } from 'react-router-dom';
import './MenuHeader.css'; 

export default class Menu extends React.Component {
  render() {
        return(
        <nav className="menu">
            {/* NavLinkは現在のURLとリンク先を比較して、
            「そのリンクが今表示されているページかどうか」を判断し、
            自動的にactiveクラスを付けてくれる。 */}
            <NavLink to="/" end className="menu-item">
                ホーム
            </NavLink>
            <NavLink to="/event" className="menu-item">
                イベント
            </NavLink>
            <NavLink to="/sugoroku" className="menu-item">
                スゴロク
            </NavLink>
            <NavLink to="/login" className="menu-item">
                ログアウト
            </NavLink>
        </nav>
        )
  }
};


