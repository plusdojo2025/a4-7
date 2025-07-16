import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SchedulePage from './schedule/SchedulePage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route index element={<SchedulePage />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
