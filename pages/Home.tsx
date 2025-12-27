
import React, { useState, useEffect } from 'react';
import { SiteConfig, TripType, BookingDetails } from '../types';

interface HomeProps {
  config: SiteConfig;
}

const Home: React.FC<HomeProps> = ({ config }) => {
  const [showAllVehicles, setShowAllVehicles] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [booking, setBooking] = useState<BookingDetails>({
    customerName: '',
    customerPhone: '',
    vehicleId: '',
    pickupLocation: '',
    dropLocation: '',
    date: '',
    time: '',
    tripType: TripType.ONE_WAY
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedVehicle = config.vehicles.find(v => v.id === booking.vehicleId);
    
    const message = `*New Booking Request from Website*
Name: ${booking.customerName}
Phone: ${booking.customerPhone}
Vehicle: ${selectedVehicle?.name || 'Not Selected'}
Pickup: ${booking.pickupLocation}
Drop: ${booking.dropLocation}
Date: ${booking.date}
Time: ${booking.time}
Type: ${booking.tripType}`;

    const waLink = `https://wa.me/${config.phones[0].replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
  };

  const selectVehicleAndScroll = (vId: string) => {
    setBooking(prev => ({ ...prev, vehicleId: vId }));
    const element = document.getElementById('booking');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const displayedVehicles = showAllVehicles ? config.vehicles : config.vehicles.slice(0, 8);
  const displayedReviews = showAllReviews ? config.reviews : config.reviews.slice(0, 6);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src={config.hero.imageUrl} className="w-full h-full object-cover" alt="Hero Background" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Trusted 24/7 Service</span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight whitespace-pre-line">
              {config.hero.title}
            </h1>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              {config.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-center transition-all shadow-xl shadow-blue-500/20">
                Book Your Ride
              </a>
              <a href={`tel:${config.phones[0]}`} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-center border border-white/20 transition-all">
                Call Us Directly
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white -mt-12 relative z-20 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white shadow-2xl rounded-2xl p-6 border border-slate-100">
          {config.stats.map((stat, i) => (
            <div key={stat.id} className={`text-center p-4 ${i > 0 ? 'md:border-l border-slate-100' : ''}`}>
              <div className="text-3xl font-black text-blue-600 mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-slate-50" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">What We Offer</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">Comprehensive Taxi Solutions</h3>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: 'fa-taxi', title: 'Local Taxi', desc: 'Navigate through Faridabad sectors with ease. Fast pickups and polite drivers for daily commuting.' },
            { icon: 'fa-plane', title: 'Airport Transfers', desc: 'On-time drops and pickups for IGI Airport. We track your flight to ensure we are there when you land.' },
            { icon: 'fa-route', title: 'Outstation Trips', desc: 'Planning a trip to Jaipur, Agra or Shimla? Our long-distance experts ensure a safe highway journey.' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <i className={`fas ${item.icon} text-2xl`}></i>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white scroll-mt-20" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Affordable Rates</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">Our Fleet & Pricing</h3>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedVehicles.map((v) => (
            <div key={v.id} className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden hover:border-blue-400 transition-all flex flex-col">
              <div className="p-8 text-center bg-white border-b border-slate-100">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                  <i className={`fas ${v.icon} text-2xl`}></i>
                </div>
                <h4 className="text-xl font-bold text-slate-900">{v.name}</h4>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Up to {v.capacity} Seats</p>
              </div>
              <div className="p-8 space-y-4 flex-grow">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Base Fare (80km/8h)</span>
                  <span className="font-bold text-slate-900">₹{v.base}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Extra Km</span>
                  <span className="font-bold text-slate-900">₹{v.km}/km</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Extra Hour</span>
                  <span className="font-bold text-slate-900">₹{v.hour}/hr</span>
                </div>
                <div className="pt-4 border-t border-slate-200">
                   <div className="bg-blue-600/5 p-4 rounded-xl border border-blue-600/10">
                    <p className="text-[10px] uppercase font-bold text-blue-600 mb-1">Best Value</p>
                    <p className="text-sm font-bold text-slate-800">Full Day Package</p>
                    <p className="text-2xl font-black text-blue-600 mt-1">₹{v.fullDay}</p>
                   </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={() => selectVehicleAndScroll(v.id)}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-calendar-check"></i> Book {v.name} Now
                </button>
              </div>
            </div>
          ))}
        </div>
        {config.vehicles.length > 8 && (
          <div className="text-center mt-12">
            <button 
              onClick={() => setShowAllVehicles(!showAllVehicles)}
              className="px-8 py-3 bg-white border-2 border-slate-200 rounded-full font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all flex items-center gap-2 mx-auto"
            >
              {showAllVehicles ? 'Minimize Fleet' : 'Show More Vehicles'}
              <i className={`fas fa-chevron-${showAllVehicles ? 'up' : 'down'} text-xs`}></i>
            </button>
          </div>
        )}
      </section>

      {/* Service Area Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Local Coverage</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-6">Our Primary Service Areas</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                We are strategically located to provide fast pickups across all sectors of Faridabad. Our drivers know the city inside out, ensuring you avoid traffic and arrive on time.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {config.serviceAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <i className="fas fa-map-marker-alt text-blue-500 text-xs"></i>
                    <span className="text-sm font-semibold">{area}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-200">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211862.53858748372!2d77.28223565572105!3d28.4937586116825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cdd7842e68353%3A0x34d9eed784d8c07b!2sJeetu%20Faridabad%20Taxi%20Service!5e0!3m2!1sen!2sin!4v1766834763553!5m2!1sen!2sin" 
                className="w-full h-full border-0" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-white" id="reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Testimonials</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">What Our Customers Say</h3>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedReviews.map((review) => (
            <div key={review.id} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-all">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < review.rating ? '' : 'text-slate-200'}`}></i>
                ))}
              </div>
              <p className="text-slate-600 italic mb-6 leading-relaxed">"{review.comment}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">{review.name}</h5>
                  <p className="text-xs text-slate-400">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {config.reviews.length > 6 && (
          <div className="text-center mt-12">
            <button 
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="px-8 py-3 bg-white border-2 border-slate-200 rounded-full font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all flex items-center gap-2 mx-auto"
            >
              {showAllReviews ? 'Minimize Reviews' : 'Show More Testimonials'}
              <i className={`fas fa-chevron-${showAllReviews ? 'up' : 'down'} text-xs`}></i>
            </button>
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50" id="faqs">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Questions?</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-4">
            {config.faqs.map((faq) => (
              <details key={faq.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <span className="font-bold text-slate-900">{faq.question}</span>
                  <span className="bg-slate-50 group-open:rotate-180 transition-transform w-8 h-8 rounded-full flex items-center justify-center">
                    <i className="fas fa-chevron-down text-xs text-slate-400"></i>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-24 bg-slate-900 relative scroll-mt-20" id="booking">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 text-white">
            <h3 className="text-3xl font-extrabold mb-6">Book Your Ride in Seconds</h3>
            <p className="text-slate-400 mb-8">Ready to start your journey? Fill out the quick form and we'll confirm your booking immediately via WhatsApp. No hidden charges, just pure service.</p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-check"></i>
                </div>
                <div>
                  <h5 className="font-bold">Instant Confirmation</h5>
                  <p className="text-sm text-slate-500">No waiting. Get driver details instantly on WhatsApp.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-car-side"></i>
                </div>
                <div>
                  <h5 className="font-bold">Sanitized Fleet</h5>
                  <p className="text-sm text-slate-500">Our cars are cleaned after every single trip.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full bg-white p-8 md:p-10 rounded-3xl shadow-2xl">
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Name</label>
                  <input 
                    type="text" required 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="John Doe"
                    value={booking.customerName}
                    onChange={(e) => setBooking({...booking, customerName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                  <input 
                    type="tel" required 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="+91 99999 00000"
                    value={booking.customerPhone}
                    onChange={(e) => setBooking({...booking, customerPhone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Vehicle</label>
                <select 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={booking.vehicleId}
                  onChange={(e) => setBooking({...booking, vehicleId: e.target.value})}
                >
                  <option value="">Choose Vehicle Type</option>
                  {config.vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} (₹{v.base} onwards)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pickup Location</label>
                  <input 
                    type="text" required 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Sector 15, Faridabad"
                    value={booking.pickupLocation}
                    onChange={(e) => setBooking({...booking, pickupLocation: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Drop Location</label>
                  <input 
                    type="text" required 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Delhi Airport T3"
                    value={booking.dropLocation}
                    onChange={(e) => setBooking({...booking, dropLocation: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date</label>
                  <input 
                    type="date" required 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={booking.date}
                    onChange={(e) => setBooking({...booking, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Time</label>
                  <input 
                    type="time" required 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={booking.time}
                    onChange={(e) => setBooking({...booking, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2">
                  <i className="fab fa-whatsapp text-lg"></i> Confirm on WhatsApp
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-widest">Instant booking • 24/7 service • Secure data</p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
