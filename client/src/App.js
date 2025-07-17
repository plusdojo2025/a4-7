import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SchedulePage from './schedule/SchedulePage';
import EventPage from './event/EventPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route index element={<SchedulePage />} />
            <Route path='/event' element={<EventPage />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
