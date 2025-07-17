import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SchedulePage from './schedule/SchedulePage';
import EventPage from './event/EventPage';
import SugorokuPage from './sugoroku/SugorokuPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route index element={<SchedulePage />} />
            <Route path='/event' element={<EventPage />} />
            <Route path='/sugoroku' element={<SugorokuPage />} />
            
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
