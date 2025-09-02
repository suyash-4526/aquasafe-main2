
'use client';
export interface WaterSample {
  id: string;
  location: string;
  date: string;
  lead: number;
  arsenic: number;
  mercury: number;
  cadmium: number;
  ph: number;
  lat: number;
  lng: number;
}

export const whoLimits = {
  lead: 0.01,
  arsenic: 0.01,
  mercury: 0.006,
  cadmium: 0.003,
  ph_min: 6.5,
  ph_max: 8.5,
};

export let mockWaterSamples: WaterSample[] = [
  { id: 'S001', location: 'Pimpri', date: '2024-07-20', lead: 0.012, arsenic: 0.008, mercury: 0.001, cadmium: 0.002, ph: 7.2, lat: 18.6286, lng: 73.8001 },
  { id: 'S002', location: 'Chinchwad', date: '2024-07-19', lead: 0.005, arsenic: 0.011, mercury: 0.003, cadmium: 0.001, ph: 7.5, lat: 18.6276, lng: 73.7816 },
  { id: 'S003', location: 'Bhosari', date: '2024-07-18', lead: 0.009, arsenic: 0.009, mercury: 0.005, cadmium: 0.003, ph: 7.1, lat: 18.6114, lng: 73.8445 },
  { id: 'S004', location: 'Nigdi', date: '2024-07-17', lead: 0.025, arsenic: 0.015, mercury: 0.007, cadmium: 0.004, ph: 6.8, lat: 18.6498, lng: 73.7644 },
  { id: 'S005', location: 'Akurdi', date: '2024-07-16', lead: 0.003, arsenic: 0.005, mercury: 0.001, cadmium: 0.001, ph: 7.8, lat: 18.6422, lng: 73.7725 },
  { id: 'S006', location: 'Ravet', date: '2024-07-15', lead: 0.008, arsenic: 0.007, mercury: 0.002, cadmium: 0.002, ph: 7.3, lat: 18.6384, lng: 73.7431 },
  { id: 'S007', location: 'Moshi', date: '2024-07-14', lead: 0.015, arsenic: 0.009, mercury: 0.004, cadmium: 0.003, ph: 6.9, lat: 18.6588, lng: 73.8568 },
  { id: 'S008', location: 'Wakad', date: '2024-07-13', lead: 0.006, arsenic: 0.012, mercury: 0.002, cadmium: 0.001, ph: 7.6, lat: 18.5968, lng: 73.7621 },
  { id: 'S009', location: 'Hinjewadi', date: '2024-07-12', lead: 0.004, arsenic: 0.006, mercury: 0.001, cadmium: 0.001, ph: 7.7, lat: 18.5902, lng: 73.7386 },
  { id: 'S010', location: 'Thergaon', date: '2024-07-11', lead: 0.011, arsenic: 0.01, mercury: 0.003, cadmium: 0.002, ph: 7.4, lat: 18.6041, lng: 73.7765 },
  { id: 'S011', location: 'Pimple Saudagar', date: '2024-07-10', lead: 0.007, arsenic: 0.008, mercury: 0.002, cadmium: 0.001, ph: 7.5, lat: 18.5986, lng: 73.7972 },
  { id: 'S012', location: 'Sangvi', date: '2024-07-09', lead: 0.018, arsenic: 0.013, mercury: 0.006, cadmium: 0.003, ph: 6.7, lat: 18.5714, lng: 73.8131 },
  { id: 'S013', location: 'Kasarwadi', date: '2024-07-08', lead: 0.022, arsenic: 0.004, mercury: 0.008, cadmium: 0.002, ph: 7.0, lat: 18.5912, lng: 73.8239 },
  { id: 'S014', location: 'Dapodi', date: '2024-07-07', lead: 0.002, arsenic: 0.018, mercury: 0.001, cadmium: 0.005, ph: 6.6, lat: 18.5746, lng: 73.8315 },
  { id: 'S015', location: 'Chikhali', date: '2024-07-06', lead: 0.013, arsenic: 0.014, mercury: 0.003, cadmium: 0.001, ph: 7.2, lat: 18.6811, lng: 73.8019 },
  { id: 'S016', location: 'Talawade', date: '2024-07-05', lead: 0.019, arsenic: 0.019, mercury: 0.005, cadmium: 0.004, ph: 6.5, lat: 18.6868, lng: 73.7686 },
  { id: 'S017', location: 'Charholi Budruk', date: '2024-07-04', lead: 0.009, arsenic: 0.002, mercury: 0.002, cadmium: 0.002, ph: 7.9, lat: 18.6477, lng: 73.8821 },
  { id: 'S018', location: 'Dighi', date: '2024-07-03', lead: 0.021, arsenic: 0.008, mercury: 0.006, cadmium: 0.003, ph: 7.1, lat: 18.6322, lng: 73.8762 },
];
