import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Fleet from './components/Fleet';
import BookingForm from './components/BookingForm';
import Stats from './components/Stats';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [selectedVehicle, setSelectedVehicle] = useState('');

  return (
    <ThemeProvider>
      <div className="min-h-screen section-bg">
        <Navbar />
        <Hero />
        <Services />
        <Fleet onSelectVehicle={setSelectedVehicle} />
        <BookingForm preselectedVehicle={selectedVehicle} />
        <Stats />
        <About />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  );
}
