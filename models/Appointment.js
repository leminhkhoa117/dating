import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  selectedDay: {
    type: String,
    required: true,  // "Thứ 6", "Thứ 7", "Chủ nhật"
  },
  selectedTime: {
    type: String,
    required: true,
  },
  pickupTime: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
