import { useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header'
import './schedule/SchedulePage.css';

// 任意のコンポーネントに location, navigate を注入するHOC
export function withRouter(Component) {
  return function WrappedComponent(props) {
    // useNavigate() → 「ページを移動する」
    // useLocation() → 「今いるページの状態や渡されたデータを見る」
    const navigate = useNavigate();
    const location = useLocation();
    return (<Component {...props} navigate={navigate} location={location} />);
  };
}
